require "mongo"

module Bets
    RUBY_TO_MONGO = {_id: :_id,
                     description: :d, # description of the bet (sub object)
                     proposer: :p, # proposer of the bet
                     acceptor: :a, # acceptor of the bet
                     p_amount: :pa,# amount wagered by proposer
                     a_amount: :aa# amount wagered by aceptor
    }

    class Bet < Struct.new *RUBY_TO_MONGO.keys
        include Mongo
        ruby_to_mongo = RUBY_TO_MONGO
    end
end
