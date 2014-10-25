task :post do
  STDOUT.puts "Title?"
  title = STDIN.gets.chomp
  system "bundle exec middleman article -b blog '#{title}'"
end

task default: :post
