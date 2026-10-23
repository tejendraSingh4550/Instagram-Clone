import { Component } from '@angular/core';

type FeedPost = {
  id: number;
  username: string;
  avatar: string;
  location: string;
  image: string;
  alt: string;
  likes: number;
  liked: boolean;
  caption: string;
  hashtags: string;
  comments: number;
  userComments: string[];
  saved: boolean;
  time: string;
};

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  composerOpen = false;
  currentSection: 'home' | 'search' | 'profile' = 'home';
  profileUsername = 'alex.morgan';
  searchQuery = '';
  activeStory: string | null = null;
  activeStoryIndex = 0;
  notice = '';
  followedAccounts = new Set<string>();
  private nextPostId = 4;

  stories = [
    { username: 'your story', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces', seen: true },
    { username: 'mila.joy', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop&crop=faces', seen: false },
    { username: 'the.weekend', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=faces', seen: false },
    { username: 'sophia.k', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=faces', seen: false },
    { username: 'wander.with.me', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces', seen: false },
    { username: 'noahframes', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces', seen: false }
  ];

  posts: FeedPost[] = [
    {
      id: 1, username: 'jess.wanders', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop&crop=faces',
      location: 'Big Sur, California', image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1080&h=1100&fit=crop',
      alt: 'A quiet mountain lake surrounded by forest', likes: 2486, liked: false,
      caption: 'Somewhere between the mountains and the sky 🌿', hashtags: '#weekendescape #nature', comments: 38, userComments: [], saved: false, time: '2 HOURS AGO'
    },
    {
      id: 2, username: 'marco.eats', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=faces',
      location: 'Brooklyn, New York', image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1080&h=1100&fit=crop',
      alt: 'Colorful brunch spread on a table', likes: 913, liked: false,
      caption: 'Slow mornings and a table full of good things ☀️', hashtags: '#brunch #foodie', comments: 16, userComments: [], saved: false, time: '5 HOURS AGO'
    },
    {
      id: 3, username: 'daily.frames', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces',
      location: 'Lisbon, Portugal', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1080&h=1100&fit=crop',
      alt: 'Golden evening light across a coastal landscape', likes: 5201, liked: false,
      caption: 'Chasing the last light of the day ✨', hashtags: '#goldenhour #travel', comments: 74, userComments: [], saved: false, time: '1 DAY AGO'
    }
  ];

  suggestions = [
    { username: 'olivia.rose', reason: 'Followed by jess.wanders', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=faces', following: false },
    { username: 'leo.outside', reason: 'Suggested for you', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces', following: false },
    { username: 'studio.ana', reason: 'Followed by 3 others', avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop&crop=faces', following: false },
    { username: 'city.weekends', reason: 'Suggested for you', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces', following: false }
  ];

  get searchAccounts(): Array<{ username: string; avatar: string; label: string }> {
    const accounts = [
      { username: 'alex.morgan', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces', label: 'Alex Morgan · You' },
      ...this.stories.slice(1).map((story) => ({ username: story.username, avatar: story.avatar, label: 'Instagram user' })),
      ...this.suggestions.map((person) => ({ username: person.username, avatar: person.avatar, label: person.reason }))
    ];
    const query = this.searchQuery.trim().toLowerCase().replace(/^@/, '');
    return query ? accounts.filter((account) => account.username.toLowerCase().includes(query)) : [];
  }

  get searchPosts(): FeedPost[] {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) return [];
    return this.posts.filter((post) => `${post.username} ${post.caption} ${post.location} ${post.hashtags}`.toLowerCase().includes(query));
  }

  get ownPosts(): FeedPost[] {
    return this.posts.filter((post) => post.username === this.profileUsername);
  }

  get profileAccount(): { username: string; avatar: string; label: string } {
    return this.searchAccounts.find((account) => account.username === this.profileUsername)
      ?? this.searchAccounts[0];
  }

  openProfile(username = 'alex.morgan'): void {
    this.profileUsername = username;
    this.currentSection = 'profile';
  }

  openSection(section: 'home' | 'search' | 'profile'): void {
    this.currentSection = section;
    if (section === 'search') this.searchQuery = '';
  }

  toggleLike(id: number): void {
    const post = this.posts.find((item) => item.id === id);
    if (post) post.liked = !post.liked;
  }

  toggleFollow(username: string): void {
    const person = this.suggestions.find((item) => item.username === username);
    if (person) {
      person.following = !person.following;
    } else if (this.followedAccounts.has(username)) {
      this.followedAccounts.delete(username);
    } else {
      this.followedAccounts.add(username);
    }
  }

  isFollowing(username: string): boolean {
    return this.suggestions.find((item) => item.username === username)?.following
      ?? this.followedAccounts.has(username);
  }

  viewStory(username: string): void {
    this.activeStoryIndex = this.stories.findIndex((item) => item.username === username);
    this.showStory();
  }

  showStory(): void {
    const story = this.stories[this.activeStoryIndex];
    if (!story) return;
    story.seen = true;
    this.activeStory = story.username;
  }

  nextStory(): void {
    this.activeStoryIndex = (this.activeStoryIndex + 1) % this.stories.length;
    this.showStory();
  }

  toggleSaved(id: number): void {
    const post = this.posts.find((item) => item.id === id);
    if (post) post.saved = !post.saved;
  }

  sharePost(id: number): void {
    const url = `${window.location.origin}/?post=${id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => this.showNotice('Link copied to clipboard'))
        .catch(() => this.showNotice(url));
    } else {
      this.showNotice(url);
    }
  }

  showNotice(message: string): void {
    this.notice = message;
    window.setTimeout(() => this.notice = '', 2600);
  }

  toggleComposer(): void {
    this.composerOpen = !this.composerOpen;
  }

  addPost(event: Event): void {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const data = new FormData(form);
    const caption = String(data.get('caption') ?? '').trim();
    if (!caption) return;
    const image = String(data.get('image') ?? '').trim();
    this.posts.unshift({
      id: this.nextPostId++, username: 'alex.morgan',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
      location: 'Just now', image: image || 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1080&h=1100&fit=crop',
      alt: caption, likes: 0, liked: false, caption, hashtags: '', comments: 0, userComments: [], saved: false, time: 'JUST NOW'
    });
    form.reset();
    this.composerOpen = false;
  }

  addComment(event: Event, postId: number): void {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const input = form.elements.namedItem('comment') as HTMLInputElement;
    const comment = input.value.trim();
    if (!comment) return;
    const post = this.posts.find((item) => item.id === postId);
    if (post) {
      post.comments++;
      post.userComments.push(comment);
    }
    form.reset();
  }
}
