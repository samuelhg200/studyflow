export function combineDateWithTime(d, t) {
	return new Date(
		d.getFullYear(),
		d.getMonth(),
		d.getDate(),
		t.getHours(),
		t.getMinutes(),
		t.getSeconds(),
		t.getMilliseconds()
	);
}

export function getIconStringBasedInEventType(eventType) {
	switch (eventType){
		case 'study-session': 
			return 'glasses-outline'
		case 'assessment':
			return 'school-outline'
		case 'homework':
			return 'book-outline'
		case 'other':
			return 'ellipsis-horizontal-outline'
		default: 
			return
			
	}
}