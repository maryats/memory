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

	def handle_in("select", %{"selected" => selected}, socket) do
	    update_state(socket, Game.select(socket.assigns[:game], selected))
 	end

 	def handle_in("guess", %{"selected" => selected}, socket) do
	    update_state(socket, Game.guess(socket.assigns[:game], selected))
 	end

 	def handle_in("restart", _payload, socket) do
 		update_state(socket, Game.new())
 	end

 	defp update_state(socket, game) do
 		name = socket.assigns[:name]
 		socket = assign(socket, :game, game)
 		BackupAgent.put(name, game)
 		{:reply, {:ok, %{ "game" => Game.client_view(game)}}, socket}
 	end

	defp authorized?(_payload) do
		true
	end
end