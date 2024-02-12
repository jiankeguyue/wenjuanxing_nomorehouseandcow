stop := false

^q::
	stop := true

^j::
	Loop
		{
			MouseGetPos, xpos, ypos
			MouseClick, , %xpos%, %ypos%
			MouseMove, 0, %ypos%
			MouseMove, %xpos%, %ypos%
			Sleep , 3000
		}
	Until stop 