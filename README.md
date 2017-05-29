# stories
stories server

```
{
  user {
    id: 1,
    facebookID: 1,
    name: "David",
    username: "david001",
    description: "android",
    followers: [],
  }
}

{
  story {
   id: 1,
   date: 19-05-2017,
   likeby: [],
   userId: 1
   stories: model.stories,
   comments: model.comments
  }
}

{
  stories: {
    id: 1,
    date: 19-05-2017,
    url: "http://awsurl.com/image.jpg",
    viewedby: [],
  }
}

{
  comments: {
    id: 1,
    userid: 1,
    date: 19-05-2017,
    comment: "hello",
  }
}
```


  | POST]      |
| ------------- |
|  /addUser             |
|  /addStory/:userID    |
| /addStories/:storyID  |
|   /addComment/:storyID|
 
 
  
|   [PUT]     |
| ------------- |
|  /likeStory/:storyID          |
| /viewStories/:storiesID  |
|  /follow/:userID/:followingUserID  |
 
 
|     [GET]   |
| ------------- |
|     (Profile page)getStoryList/:userID    |
|       (Wall)getStoryWall/:userID [get followers, then get their latest stories etc  |




//registration happens outside of grahql
//add + update story/stories
//add story [press upload add to stories for current story, story is based on ]
//pass todays date, check if there is story for this date? return story id
//other wise create a story and return the id
//create stories 

//do customh join to show whos viewed and liked



//update story - likes - x
//update story - comments - x
//update storyfragment - viewed - x
//update users, follow
//update users - desc?



/*
mutation {
    addStoryFragment(userId: 1, date:"2017-05-28", url:"new.jpg") {
		id,
    viewedby
    }
  }


query {
  stories(userId: 1) {
    id,
    storyfragments {
      date,
      url
    }
  } 
}*/