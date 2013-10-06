require 'rubygems'
require 'bundler/setup'
require 'mongo'
require_relative './alphabet/alphabet'

mongo_client = Mongo::MongoClient.new('localhost', 27017)
tekstflyt = Alphabet.new(Mongo::MongoClient.new('localhost', 27017))
bet_m = Alphabet.bet_m

task :clean do |t|
    mongo client.drop_database('alphabet')
end

task :setup do |t|
    db = mongo_client.db('alphabet')
    bet_m.create({description: 'A silly bet.', proposer: 'zencephalon', acceptor: 'carlos', p_amount: 500, a_amount: 1000})
end
