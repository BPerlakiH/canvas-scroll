require "listen"

build_cmd = "npm run build"

listener = Listen.to('src') do |modified, added, removed|
	puts "Change detected\n"	
	system build_cmd
end

#run it on start
system build_cmd

puts "\nListening to folder changes\n"
listener.start
sleep