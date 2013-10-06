require 'rubygems'
require 'bundler/setup'

require 'sinatra'
require 'mongo'
require 'json'
require 'net/http'
require 'uri'
require 'compass'

require_relative './alphabet/alphabet'
require_relative './secrets'

class AlphabetApp < Sinatra::Base
    enable :sessions
    set :bind, '0.0.0.0'
    set :port, 1111

    VENMO = "https://api.venmo.com"

    $alphabet = Alphabet.new(Mongo::MongoClient.new('localhost', 27017))
    $bet_m = $alphabet.bet_m
    $user_m = $alphabet.user_m

    # ============ Helpers ==================
    helpers do
        def logged_in?
            !session[:user].nil?
        end

        def user
            session[:user]
        end
    end

    set(:auth) do |roles|
        condition do
            redirect '/login', 303 unless logged_in?
        end
    end

    # ============== Main Site Routs ============
    get '/' do
        liquid :index
    end

    get '/main', auth: :user do
        liquid :main
    end

    get '/categories.json' do
        content_type :json
        ['general'].to_json
    end

    # ================= Bets ===================
    get '/feed.json' do
        content_type :json
        $bet_m.get_all.to_json
    end

    get '/bets' do
        liquid :bet
    end
    
    get '/bet.json' do
        content_type :json
        id = params[:_id]

        bet = $bet_m.get(id)
        return (bet ? bet : []).to_json
    end

    post '/bet' do
        opt_hash = {}
        ['description', 'proposer', 'acceptor', 'arbiter', 'p_amount', 'a_amount', 'proposer_name', 'acceptor_name', 'arbiter_name', 'proposer_pic', 'arbiter_pic', 'acceptor_pic'].each do |key|
            opt_hash[key] = params[key]
        end

        $bet_m.create(opt_hash)
    end

    delete '/bet' do
        # delete a bet
    end

    post '/bet/resolve' do

    end

    # ================ Venmo Endpoints =============

    get '/me.json' do
        content_type :json
        return (logged_in? ? session[:user] : []).to_json
    end

    get '/friends.json' do
        content_type :json
        if logged_in?
            uri = URI.parse("#{VENMO}/users/#{session[:user]['id']}/friends?access_token=#{session[:user_token]}&limit=1000")
            return Net::HTTP.get(uri)
        else
            return [].to_json
        end
    end

    get '/user.json' do
        id = params[:id]
        if logged_in?
            uri = URI.parse("#{VENMO}/users/#{id}?access_token=#{session[:user_token]}")
            return Net::HTTP.get(uri)
        else
            return [].to_json
        end
    end

    # =================== Login ====================
    get '/login' do
        redirect "#{VENMO}/oauth/authorize?client_id=1431&scope=ACCESS_FRIENDS,ACCESS_PROFILE,MAKE_PAYMENTS&response_type=code", 303
    end

    get '/venmo_login' do
        session[:access_code] = params[:code]
        
        uri = URI.parse("#{VENMO}/oauth/access_token")
        response = JSON.parse(Net::HTTP.post_form(uri, {'client_id' => 1431, 'client_secret' => Secrets::CLIENT_SECRET, 'code' => session[:access_code]}).body)

        session[:user_token] = response['access_token']
        session[:user] = response['user']

        $user_m.create({_id: session[:user]['id'], token: session[:user_token]})

        redirect '/main', 303
    end

    # ============ Error Pages =========================
    not_found do
        liquid :fourohfour, layout: false
    end

    error do
        liquid :fivehundred, layout: false
    end

    # ================== Compass =======================
    configure do
        Compass.configuration do |config|
            config.project_path = File.dirname(__FILE__)
            config.sass_path = 'views/stylesheets/'
        end

        set :sass, Compass.sass_engine_options
        set :scss, Compass.sass_engine_options
    end

    get '/sass.css' do
        sass :sass_file
    end

    get '/screen.css' do
         scss(:"stylesheets/screen" )
    end
end

if __FILE__ == $0
    AlphabetApp.run!
end
