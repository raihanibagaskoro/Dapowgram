function published(value) {
    const timeNow = new Date().toISOString().split('T')[1].split('.')[0].split(':')
    const publishedTime = value.toISOString().split('T')[1].split('.')[0].split(':')
    
    if(timeNow[0] == publishedTime[0]) {
      return `${timeNow[1] - publishedTime[1]} minutes ago`;
    } else {
      return `${timeNow[0] - publishedTime[0]} hours ago`;
    }
  }
  
  module.exports = { published };