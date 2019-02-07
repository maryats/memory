defmodule Memory.MemoryTest do
  use ExUnit.Case
  import Memory.Game

  test "client view" do
  	assert client_view(%{selected: [], matched: [], tiles: ["A", "B", "A", "B"]}) ==
  		%{selected: [], matched: [], tiles: ["", "", "", ""]}
  	assert client_view(%{selected: [1], matched: [], tiles: ["A", "B", "A", "B"]}) ==
  		%{selected: [1], matched: [], tiles: ["", "B", "", ""]}
  	assert client_view(%{selected: [], matched: [0, 2], tiles: ["A", "B", "A", "B"]}) ==
  		%{selected: [], matched: [0, 2], tiles: ["A", "", "A", ""]}
  	assert client_view(%{selected: [1], matched: [0, 2], tiles: ["A", "B", "A", "B"]}) ==
  		%{selected: [1], matched: [0, 2], tiles: ["A", "B", "A", ""]}
  end

  test "obfuscate tiles" do
  	assert obfuscate(["A", "B", "C"], []) == ["", "", ""]
  	assert obfuscate(["A", "A", "A"], [1]) == ["", "A", ""]
  end

  test "select tiles" do
  	# updates selected field and increments clicks
	assert select(%{selected: [], num_clicks: 0}, ["A"]) == 
		%{selected: ["A"], num_clicks: 1}
	assert select(%{selected: ["A"], num_clicks: 0}, ["A"]) == 
		%{selected: ["A"], num_clicks: 1}
	assert select(%{selected: ["A"], num_clicks: 0}, ["B"]) == 
		%{selected: ["B"], num_clicks: 1}
	assert select(%{selected: ["A"], num_clicks: 0}, ["A", "B"]) 
		== %{selected: ["A", "B"], num_clicks: 1}

	# don't increment clicks when handling invalid selected (0 or > 2 items selected)
  	assert select(%{selected: ["A"]}, []) == %{selected: []}
  	assert select(%{selected: ["A"]}, ["A", "B", "C"]) == %{selected: []}
  end

  test "guess" do
  	assert guess(%{tiles: ["A", "A", "B", "B"]}, [1, 2]) == 
  		%{tiles: ["A", "A", "B", "B"], selected: []}
  	assert guess(%{tiles: ["A", "A", "B", "B"], matched: [3,4]}, [0, 1]) == 
  		%{tiles: ["A", "A", "B", "B"], matched: [0, 1, 3, 4], selected: []}
  end
end