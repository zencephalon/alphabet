require "mongo"

module Bets
    RUBY_TO_MONGO = {_id: :_id,
                     description: :d, # description of the bet (string)
                     proposer: :p,  # proposer of the bet (string)
                     acceptor: :a,  # acceptor of the bet (string)
                     arbiter: :rb,  # arbiter of the bet (string optional)
                     p_amount: :pa, # amount wagered by proposer in cents (int)
                     a_amount: :aa, # amount wagered by aceptor in cents (int)
                     type: :t,      # type of bet (string)
                     condition: :c, # condition for auto-arb bets (object ref)
    }
    MONGO_TO_RUBY = RUBY_TO_MONGO.invert.freeze

    class Bet < Struct.new *RUBY_TO_MONGO.keys
        include Mongo
        ruby_to_mongo = RUBY_TO_MONGO
    end

    class BetManager
        def initialize(alphabet)
            @alphabet = alphabet
            @bet_db = alphabet.db.collection('bets')
        end

        def mongo_to_ruby(mongo_obj)
            bet = Bet.new
            mongo_obj.each do |key, val|
                bet[MONGO_TO_RUBY[key.to_sym]] = val if val
            end
            return bet
        end

        def create(opt_hash)
            bet = Bet.new
            opt_hash.each do |opt, val|
                bet[opt] = val
            end

            mongo_obj = bet.to_mongo
            @bet_db.insert(mongo_obj)

            return bet
        end

        def get_all()
            @bet_db.find({limit: 100}).to_a.map {|b| mongo_to_ruby(b).to_liquid}
        end
    end
end
