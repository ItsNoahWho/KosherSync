local KosherSync = script:FindFirstAncestor("KosherSync")

local Types = require(KosherSync.Types)

local Meta = {}
Meta.__index = Meta

function Meta.new(): Types.Meta
	local self = setmetatable({}, Meta)

	self.keepUnknowns = false
	self.meshSource = nil

	return self
end

return Meta
