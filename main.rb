require 'rubygems'
require 'bundler/setup'

require 'sinatra'
require 'mongo'

class Alphabet < Sinatra::Base
    enable :sessions
    set :bind, '0.0.0.0'
    set :port, 1111

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

    get '/login' do
        liquid :login
    end

    get '/logout' do

    end

    not_found do
        liquid :fourohfour, layout: false
    end

    error do
        liquid :fivehundred, layout: false
    end
end

if __FILE__ == $0
    Alphabet.run!
end
