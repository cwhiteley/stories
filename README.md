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



