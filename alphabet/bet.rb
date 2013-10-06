require_relative './mongo'

module Bets
    RUBY_TO_MONGO = {_id: :_id,
                     description: :d, # description of the bet (string)
                     proposer: :p,  # proposer of the bet id (string)
                     acceptor: :a,  # acceptor of the bet id (string)
                     arbiter: :rb,  # arbiter of the bet id (string optional)
                     proposer_name: :pn,
                     acceptor_name: :an,
                     arbiter_name: :rbn,
                     proposer_pic: :pp,
                     acceptor_pic: :ap,
                     arbiter_pic: :rbp,
                     p_amount: :pa, # amount wagered by proposer in cents (int)
                     a_amount: :aa, # amount wagered by aceptor in cents (int)
                     type: :t,      # type of bet (string)
                     condition: :c, # condition for auto-arb bets (object ref)
                     resolved: :r,
    }.freeze
    MONGO_TO_RUBY = RUBY_TO_MONGO.invert.freeze

    class Bet < Struct.new *RUBY_TO_MONGO.keys
        def self.ruby_to_mongo 
            RUBY_TO_MONGO
        end

        include Mongo
    end

    class BetManager
        def initialize(alphabet)
            @alphabet = alphabet
            @bet_db = @alphabet.db.collection('bets')
            @user_m = @alphabet.user_m
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

        def resolve(id, user_id)
            bet = get(id)
            if bet
                bet.resolved = user_id
                p = bet.proposer
                proposer = @user_m.get(p)

                # the proposer won the bet, he makes a charge
               # if p == user_id
               #     uri = URI.parse("https://api.venmo.com/payments
               # else

               # end

            end
        end

        def get_all()
            @bet_db.find({}, {limit: 100}).to_a.map {|b| mongo_to_ruby(b).to_liquid}
        end

        def get(id)
            bet = @bet_db.find_one({_id: id})
            return bet ? mongo_to_ruby(bet) : nil
        end
    end
end
