require 'rubygems'
require 'bundler/setup'
require 'mongo'
require_relative './alphabet/alphabet'

mongo_client = Mongo::MongoClient.new('localhost', 27017)
alphabet = Alphabet.new(Mongo::MongoClient.new('localhost', 27017))
bet_m = alphabet.bet_m

task :clean do |t|
    mongo mongo_client.drop_database('alphabet')
end

task :setup do |t|
    db = mongo_client.db('alphabet')
    bet_m.create({description: 'A silly bet.', proposer: '1337', acceptor: '9393', arbiter: '999', arbiter_name: 'Jeremy Cimafonte', p_amount: 500, a_amount: 1000, proposer_name: 'Matt Bunday', acceptor_name: 'Carlos Gil'})
end
