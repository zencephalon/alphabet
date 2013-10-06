require 'rubygems'
require 'mongo'
require_relative 'bet'

class Alphabet
    attr_reader :db, :bet_m

    def initialize(client)
        @client = client
        @db = @client.db('alphabet')
        @bet_m = BetManager.new(self)
    end



end