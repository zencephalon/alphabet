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
        # take bet id and winner name
    end

    post '/bet' do
        # create the bet
    end

    delete '/bet' do
        # delete a bet
    end

    get '/me' do
        content_type :json

        if logged_in?
            return session[:user].to_json
        else
            return [].to_json
        end
    end

    get '/venmo_login' do
        session[:access_code] = params[:code]
        
        uri = URI.parse('https://api.venmo.com/oauth/access_token')
        response = Net::HTTP.post_form(uri, {'client_id' => 1431, 'client_secret' => Secrets::CLIENT_SECRET, 'code' => session[:access_code]})

        response = response.body
        session[:user_token] = response['access_token']
        session[:user] = response['user']

        File.open("debug","w") do |f|
            f.puts Secrets::CLIENT_SECRET
            f.puts session[:access_code]
            f.puts response
            f.puts "-------------"
            f.puts session[:user]
        end

        redirect '/', 303
    end

    get '/logout' do

    end

    # if logged in CHANGE USING PERMISSIONS
    get '/main' do
        liquid :main

    end

    get '/bet' do
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
