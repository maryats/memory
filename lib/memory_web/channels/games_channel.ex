defmodule MemoryWeb.GamesChannel do
	use MemoryWeb, :channel 

	alias Memory.Game
	alias Memory.BackupAgent

	def join("games:" <> name, payload, socket) do
		if authorized?(payload) do
			game = BackupAgent.get(name) || Game.new()
			socket = socket
			|> assign(:game, game)
			|> assign(:name, name)
			BackupAgent.put(name, game)
			{:ok, %{"join" => name, "game" => Game.client_view(game)}, socket}
		else
			{:error, %{reason: "unauthorized"}}
		end
	end

 	def handle_in("guess", %{"selected" => selected}, socket) do
	    name = socket.assigns[:name]
	    game = Game.guess(socket.assigns[:game], selected)
	    socket = assign(socket, :game, game)
	    BackupAgent.put(name, game)

	    Process.send_after(self(), {:clear_select, game}, 1500)
	    {:reply, {:ok, %{ "game" => Game.client_view(game)}}, socket}
 	end

 	def clear_select(game) do
 		IO.puts("PLEASE")
 	end

 	def handle_in("clear_select", game, socket) do
 		IO.puts("HEY")
 		name = socket.assigns[:name]
 		game = Game.clear_select(game)
 		BackupAgent.put(name, game)
 		{:reply, {:ok, %{ "game" => Game.client_view(game)}}, socket}
 	end

 	def handle_in("restart", _payload, socket) do
 		name = socket.assigns[:name]
 		game = Game.new()
 		socket = assign(socket, :game, game)
 		BackupAgent.put(name, game)
 		{:reply, {:ok, %{ "game" => Game.client_view(game)}}, socket}
 	end

	defp authorized?(_payload) do
		true
	end
end