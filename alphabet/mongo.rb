module Mongo

    def self.included(base)
        base.send :attr_accessor, :ruby_to_mongo unless base.respond_to?(:ruby_to_mongo=)
    end

    def to_mongo
        mongo_obj = {}
        self.class.ruby_to_mongo.each do |key, val|
            mongo_obj[val] = self[key] if self[key]
        end
        return mongo_obj
    end

    def to_liquid
        liquid_obj = {}
        self.class.ruby_to_mongo.each do |key, val|
            liquid_obj[key.to_s] = self[key] if self[key]
        end
        return liquid_obj
    end
end
