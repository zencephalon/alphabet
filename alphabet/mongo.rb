module Mongo
    DEFAULT_RUBY_TO_MONGO = {_id: :_id}

    def self.included(base)
        base.send :attr_accessor :ruby_to_mongo unless base.respond_to?(:ruby_to_mongo=)
        base.ruby_to_mongo ||= Mongo::DEFAULT_RUBY_TO_MONGO
    end

    def to_mongo
end
