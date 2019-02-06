defmodule Memory.Game do
	def new do
		%{
			num_clicks: 0,
			selected: [],
			matched: [],
			tiles: shuffle_tiles()
		}
	end

	def client_view(game) do
		%{
			num_clicks: game.num_clicks,
			selected: game.selected,
			matched: game.matched,
			tiles: obfuscate(game.tiles, game.selected ++ game.matched)
		}
	end

	def obfuscate(tiles, visible) do
		t = Enum.with_index(tiles)

		Enum.map t, fn {tile, idx} ->
			if Enum.member?(visible, idx) do
				tile
			else
				""
			end
		end
	end

	def shuffle_tiles() do 
		Enum.shuffle(["A", "A", "B", "B", "C", "C", "D", "D", "E", "E", "F",  "F", "G",  "G", "H",  "H"]);
	end

	def guess(game, [first]) do
		gs = game.selected
		|> MapSet.new()
		|> MapSet.put(first)
		|> MapSet.to_list

		Map.put(game, :selected, gs)
	end

	def guess(game, [first, second]) do
		gs = game.selected
			|> MapSet.new()
			|> MapSet.put(first)
			|> MapSet.put(second)
			|> MapSet.to_list

		if (Enum.fetch(game, first) == Enum.fetch(game, second)) do
			IO.puts(Map.fetch(game, first))

			game
			|> Map.put(:matched, gs)
			|> Map.put(:selected, gs)
		else
			Map.put(game, :selected, gs)
			# :timer.apply_after(1000, __MODULE__, clear_select(game), game) 
		end
	end

	def clear_select(game) do
		if (game.selected.length == 2) do
			Map.put(game, :selected, [])	
		else
			game
		end
	end

end