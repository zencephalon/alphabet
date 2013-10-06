require 'rubygems'
require 'bundler/setup'

require 'sinatra'
require 'mongo'
require 'json'

require 'compass'

require_relative './alphabet/alphabet'

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

    get '/login' do
        liquid :login
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
