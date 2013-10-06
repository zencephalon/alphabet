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
        end
    end
end
