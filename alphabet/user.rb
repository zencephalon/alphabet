require_relative './mongo'

module Users
    RUBY_TO_MONGO = {_id: :_id,
                     token: :t,
    }.freeze
    MONGO_TO_RUBY = RUBY_TO_MONGO.invert.freeze

    class User < Struct.new *RUBY_TO_MONGO.keys
        def self.ruby_to_mongo
            RUBY_TO_MONGO
        end

        include Mongo
    end

    class UserManager
        def initialize(alphabet)
            @alphabet = alphabet
            @user_db = alphabet.db.collection('users')
        end

        def get(id)
            user = @user_db.find_one({_id: id})
            return user ? mongo_to_ruby(user) : nil
        end
    end
end
