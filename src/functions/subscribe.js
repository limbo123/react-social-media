export const handleSubscribe = (currentUser, user, firestore, isUserSubscribed) => {
    
    return new Promise((resolve) => {
        const currentUserSubscribes = currentUser.user.subscribes;
    const userSubscribers = user.user.subscribers;
    if (isUserSubscribed) {
      console.log("unsubscribe");
      const newSubscribes = currentUserSubscribes.filter(
        (subscribe) => subscribe !== user.user.nickname
      );
      console.log(currentUserSubscribes);
      firestore.collection("users").doc(currentUser.id).update({
        subscribes: newSubscribes,
      });

      const newSubscribers = userSubscribers.filter(
        (subscriber) => subscriber !== currentUser.user.nickname
      );
      firestore
        .collection("users")
        .doc(user.id)
        .update({
          subscribers: newSubscribers,
        })
        .then(() => resolve(false));
    } else {
      console.log("subscribe");
      currentUserSubscribes.push(user.user.nickname);
      firestore.collection("users").doc(currentUser.id).update({
        subscribes: currentUserSubscribes,
      });
      userSubscribers.push(currentUser.user.nickname);
      firestore
        .collection("users")
        .doc(user.id)
        .update({
          subscribers: userSubscribers,
        })
        .then(() => resolve(true));
    }
    })
  
}