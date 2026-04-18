const memoryStore = {}

export function getStudentMemory(userId){

if(!memoryStore[userId]){

memoryStore[userId] = {

track:"Python",
level:"Beginner",

curriculum:[],

lessonIndex:0,

difficulty:"normal",

exerciseHistory:[]

}

}

return memoryStore[userId]

}