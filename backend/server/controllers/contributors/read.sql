select 
	u.email 
from 
	userdata.ListShare s 
	inner join userdata.enduser u on s.enduser = u.id 
Where 
	s.list=${listid}