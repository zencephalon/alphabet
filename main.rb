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

    $alphabet = Alphabet.new(Mongo::MongoClient.new('localhost', 27017))
    $bet_m = $alphabet.bet_m

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
            redirect '/', 303 unless logged_in?
        end
    end

    get '/' do
        liquid :index
    end

    get '/feed.json' do
        content_type :json

        bets = $bet_m.get_all
        bets.to_json
    end

    get '/categories.json' do
        content_type :json

        ['general'].to_json
    end

    get '/login' do
        redirect 'https://api.venmo.com/oauth/authorize?client_id=1431&scope=ACCESS_FRIENDS,ACCESS_PROFILE,MAKE_PAYMENTS&response_type=code', 303
    end

    post '/bet/resolve' do

    end

    get '/bet.json' do
        content_type :json
        id = params[:_id]

        bet = $bet_m.get(id)
        return (bet ? bet : []).to_json
    end

    post '/bet' do
        opt_hash = {}
        ['description', 'proposer', 'acceptor', 'arbiter', 'p_amount', 'a_amount'].each do |key|
            opt_hash[key] = params[key]
        end

        $bet_m.create(opt_hash)
    end

    delete '/bet' do
        # delete a bet
    end

    get '/me.json' do
        content_type :json

        if logged_in?
            return session[:user].to_json
        else
            return [].to_json
        end
    end

    get '/friends.json' do
        content_type :json
        if logged_in?
            uri = URI.parse("https://api.venmo.com/users/#{session[:user]['id']}/friends?access_token=#{session[:user_token]}&limit=1000")

            return Net::HTTP.get(uri)
        else
            return [].to_json
        end
    end

    get '/venmo_login' do
        session[:access_code] = params[:code]
        
        uri = URI.parse('https://api.venmo.com/oauth/access_token')
        response = Net::HTTP.post_form(uri, {'client_id' => 1431, 'client_secret' => Secrets::CLIENT_SECRET, 'code' => session[:access_code]})

        response = JSON.parse(response.body)
        session[:user_token] = response['access_token']
        session[:user] = response["user"]

        redirect '/', 303
    end

    # if logged in CHANGE USING PERMISSIONS
    get '/main' do
        liquid :main

    end

    get '/bets' do
        liquid :bet
    end

    not_found do
        liquid :fourohfour, layout: false
    end

    error do
        liquid :fivehundred, layout: false
    end
end

if __FILE__ == $0
    AlphabetApp.run!
end
