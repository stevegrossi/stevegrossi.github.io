require 'middleman-gh-pages'

task :post do
  STDOUT.puts "Title?"
  title = STDIN.gets.chomp
  system "middleman article -b blog '#{title}'"
end

task default: :post
