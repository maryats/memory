defmodule Memory.Game do
	def new do
		%{
			num_clicks: 0,
			selected: [],
			matched: [],
			tiles: Enum.shuffle(["A", "A", "B", "B", "C", "C", "D", "D", "E", "E", "F",  "F", "G",  "G", "H",  "H"])
		}
	end

	def client_view(game) do
		Map.put(game, :tiles, obfuscate(game.tiles, game.selected ++ game.matched))
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

	def select(game, [first]) do
		select_and_count_click(game, [first])
	end

	def select(game, [first, second]) do
		select_and_count_click(game, [first, second])
	end

	# guard against client sending improper (0 or > 2) number of selected items
	def select(game, _selected) do
		Map.put(game, :selected, [])
	end

	defp select_and_count_click(game, selected) do
		gs = selected
		|> MapSet.new() # de-duplicate just in case
		|> MapSet.to_list

		game
		|> Map.put(:selected, gs)
		|> Map.put(:num_clicks, game.num_clicks + 1)
	end

	def guess(game, [first, second]) do
		if (Enum.fetch!(game.tiles, first) == Enum.fetch!(game.tiles, second)) do
			matched = game.matched
			|> MapSet.new()
			|> MapSet.put(first)
			|> MapSet.put(second)
			|> MapSet.to_list

			game
			|> Map.put(:matched, matched)
			|> Map.put(:selected, [])
		else 
			Map.put(game, :selected, [])
		end
	end
end