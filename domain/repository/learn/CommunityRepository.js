

// export class CommunityRepository {
//     constructor() {
//       this.posts = [
//         new CommunityPost(
//           1,
//           'John Farmer',
//           '👨‍🌾',
//           'Just harvested my first organic tomatoes! The yield was amazing using the techniques I learned from Zao courses.',
//           15,
//           8,
//           3,
//           new Date()
//         ),
//         new CommunityPost(
//           2,
//           'Sarah Green',
//           '👩‍🌾',
//           'Has anyone tried companion planting with marigolds? I heard it helps with pest control.',
//           12,
//           5,
//           2,
//           new Date()
//         ),
//         new CommunityPost(
//           3,
//           'Mike Agriculture',
//           '🧑‍🌾',
//           'Sharing my experience with drip irrigation systems. Game changer for water conservation!',
//           20,
//           12,
//           7,
//           new Date()
//         ),
//       ];
//     }
  
//     async getCommunityPosts() {
//       return new Promise((resolve) => {
//         setTimeout(() => resolve(this.posts), 300);
//       });
//     }
  
//     async likePost(postId) {
//       const post = this.posts.find(p => p.id === postId);
//       if (post) {
//         post.likes += 1;
//       }
//       return post;
//     }
//   }