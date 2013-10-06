require 'rubygems'
require 'mongo'
require_relative 'bet'
require_relative 'user'

class Alphabet
    attr_reader :db, :bet_m, :user_m

    def initialize(client)
        @client = client
        @db = @client.db('alphabet')
        @bet_m = Bets::BetManager.new(self)
        @user_m = Users::UserManager.new(self)
    end
end
