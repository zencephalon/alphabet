root = "#{Dir.getwd}"

activate_control_app "tcp://127.0.0.1:1111"
bind "unix:///tmp/puma.alphabet.sock"
pidfile "#{root}/tmp/pids/puma.pid"
rackup "#{root}/config.ru"
state_path "#{root}/tmp/pids/puma.state"
