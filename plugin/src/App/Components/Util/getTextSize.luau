local TextService = game:GetService("TextService")

local KosherSync = script:FindFirstAncestor("KosherSync")
local App = KosherSync.App

local Theme = require(App.Theme)

return function(text: string, fontSize: number?, font: Enum.Font?, frameSize: Vector2?): Vector2
	return TextService:GetTextSize(
		text:gsub("<[^>]+>", ""), -- Remove RichText tags
		fontSize or Theme.TextSize.Large,
		font or Theme.Fonts.Enums.Regular,
		frameSize or Vector2.new(math.huge, math.huge)
	)
end
