<template>
  <section>
    <article
      v-for="item in items"
      :key="item.id"
      ref="article"
      @click="toggleActive($event)"
    >
      <header>
        <h2>
          <span>{{ item.adjective }}</span
          >&nbsp;<span>{{ item.noun }}</span>
        </h2>
      </header>
      <figure>
        <img
          :src="item.image.src"
          :alt="item.image.title + ' - ' + item.image.description"
          :title="item.image.title"
        />
      </figure>
    </article>
  </section>
</template>

<script>
import utils from '@/plugins/utils'

export default {
  data() {
    return {
      imageSize: 750,
      images: [
        'Breast',
        'Bullying',
        'Great white shark',
        'Unicycle',
        'Lithopedion',
        'Flat Earth',
        'Stop sign',
        'Milky Way',
        'Uranus',
        'Allegory of the cave',
        'American Gothic',
        'The Creation of Adam',
        'Mona Lisa',
        'David (Michelangelo)',
        'Adolf Hitler',
        'George W. Bush',
        'Phil McGraw',
        'American flamingo',
        'Balloon',
        'Car',
        'Mountain myzomela',
        'Breastfeeding difficulties',
        'Caryophyllaceae',
        'CD player',
        'Phonograph record',
        'Red',
        'Black',
        'Neil deGrasse Tyson',
        'Donald Trump',
        'Camera',
        'Human',
        'Evil',
        'Devil',
        'God',
        'Angel',
        'Truth',
        'Dolly Parton',
        'Jesus',
        'Pornography',
        'Kanye West',
        'Marilyn Monroe',
        'Elvis Presley',
        'Barbie',
        'IPhone',
        'Racing',
        'Blobject',
        'Furniture',
        'Tamagotchi',
        'Earth',
        'Mars',
        'USS Doherty (DE-14)',
        'Gaten Matarazzo',
        'Memory management controller',
        'Homosexuality in China',
        'Socks and sandals',
        'Heterodontosaurus',
        'Karate',
        'United States invasion of Grenada',
        'CMLL World Middleweight Championship',
        'Saint Anne',
        'Gopnik',
        'Interservice rivalry',
        'SPP-1 underwater pistol',
        'Chocolate bloom',
        'Sloth bear',
        'Willie Nelson',
        'Lambda phage',
        "Florence Y'all Water Tower",
        'Embryo space colonization',
        'Moon landing conspiracy theories',
        'Black hairy tongue',
        'Animals in space',
        'Chick sexing',
        'Toilets in Japan',
        'Gun',
        'The Headington Shark',
        'Electroencephalophone',
        'Competitive eating',
        'Diet Coke and Mentos eruption',
        'Pillow Fight League',
        'Rabbit show jumping',
        'Nuclear weapon',
        'Volcano',
        'Church of Scientology',
        'Galaxy',
        'On the Mindless Menace of Violence',
        'Novaya Zemlya effect',
      ],
      adjectives: [
        // https://www.momswhothink.com/list-of-adjectives/
        'Miserable',
        'Shared',
        'Slim',
        'Cold',
        'Predictable',
        'Eternal',
        'Radical',
        'Accurate',
        'Average',
        'Imminent',
        'Immense',
        'Spiritual',
        'Temporary',
        'Digital',
        'Physical',
        'Meta',
        'Suspicious',
        'Massive',
        'Established',
        'Magical',
        'Full-time',
        'Over-stated',
        'Implicit',
        'Ancient',
        'Violent',
        'Ambitious',
        'Questionable',
        'Old-fashioned',
        'Idiotic',
        'Super',
        'Wholesale',
        'Combative',
        'Mundane',
        'Quickest',
        'Inexpensive',
        'Enchanted',
        'Awful',
        'Operational',
        'Unwanted',
        'Clinical',
        'Unconscious',
        'Rigid',
        'Persistent',
        'Common',
        'Vivid',
        'Interim',
        'Tense',
        'Decisive',
        'Divine',
        'Distributed',
        'Resulting',
        'Delighted',
        'Varied',
        'Strange',
        'Meaningful',
        'Unlawful',
        'Useful',
        'Magical',
        'Weak',
        'Continuous',
        'Ancient',
        'Rational',
        'Gentle',
        'Adorable',
        'Beautiful',
        'Clean',
        'Drab',
        'Elegant',
        'Fancy',
        'Glamorous',
        'Handsome',
        'Long',
        'Magnificent',
        'Old-Fashioned',
        'Plain',
        'Quaint',
        'Sparkling',
        'Ugliest',
        'Unsightly',
        'Wide-Eyed',
        'Agreeable',
        'Brave',
        'Calm',
        'Delightful',
        'Eager',
        'Faithful',
        'Gentle',
        'Happy',
        'Jolly',
        'Kind',
        'Lively',
        'Nice',
        'Obedient',
        'Proud',
        'Relieved',
        'Silly',
        'Thankful',
        'Victorious',
        'Witty',
        'Zealous',
        'Angry',
        'Bewildered',
        'Clumsy',
        'Defeated',
        'Embarrassed',
        'Fierce',
        'Grumpy',
        'Helpless',
        'Itchy',
        'Jealous',
        'Lazy',
        'Mysterious',
        'Nervous',
        'Obnoxious',
        'Panicky',
        'Repulsive',
        'Scary',
        'Thoughtless',
        'Uptight',
        'Worried',
        'Broad',
        'Chubby',
        'Crooked',
        'Curved',
        'Deep',
        'Flat',
        'High',
        'Hollow',
        'Low',
        'Narrow',
        'Round',
        'Shallow',
        'Skinny',
        'Square',
        'Steep',
        'Straight',
        'Wide',
      ],
      nouns: [
        'Economy',
        'Romance',
        'Reputation',
        'Bureaucracy',
        'Being',
        'Warmth',
        'Relief',
        'Truth',
        'Pity',
        'Domain',
        'Weapon',
        'Guest',
        'Love',
        'Protest',
        'Allowance',
        'Disruption',
        'Violation',
        'Information',
        'Instrument',
        'Exposure',
        'Essence',
        'Arrangement',
        'Environment',
        'Facade',
        'Drama',
        'Robbery',
        'Hero',
        'Customer',
        'Suspicion',
        'Refugee',
        'Pest',
        'Cost',
        'Authority',
        'Barrier',
        'Divorce',
        'Romance',
        'Fixture',
        'Trophy',
        'Goalkeeper',
        'Residue',
        'Division',
        'Punishment',
        'Department',
        'Service',
        'Worship',
        'Sex',
        'Sound',
        'Application',
        'Regiment',
        'Migration',
        'Game',
        'Adoption',
        'Remedy',
        'Suggestion',
        'Trustee',
        'Holiday',
        'Insight',
        'Majesty',
        'Boundary',
        'Allowance',
        'Equality',
        'Viewpoint',
        'Newcomer',
      ],
      items: [],
    }
  },
  mounted() {
    this.shuffleItems()
    this.createItems()
  },
  created() {
    this.$app.$store.commit('setTheme', {
      background: '#000000',
      foreground: '#4A462A',
      accent: '#4A462A',
    })
  },
  methods: {
    shuffleItems() {
      utils.shuffle(this.images)
      utils.shuffle(this.adjectives)
      utils.shuffle(this.nouns)
    },
    async fetchImage(query) {
      let url = 'https://en.wikipedia.org/w/api.php'
      let result = null

      const params = {
        action: 'query',
        prop: 'pageimages|pageterms',
        titles: query,
        formatversion: '2',
        pithumbsize: this.imageSize,
        format: 'json',
      }

      url = url + '?origin=*'
      Object.keys(params).forEach(function(key) {
        url += '&' + key + '=' + params[key]
      })

      await fetch(url)
        .then(response => {
          return response.json()
        })
        .then(response => {
          const data = {
            title: response.query.pages[0].title,
            src: response.query.pages[0].thumbnail.source || null,
            terms: response.query.pages[0].terms.alias,
            description: response.query.pages[0].terms.description,
          }

          result = data
        })
        .catch(error => {
          console.log(error)
        })
      return result
    },
    async createItems() {
      const numberOfPosts = this.images.length

      for (let i = 0; i < numberOfPosts; i++) {
        const image = await this.fetchImage(this.images[i])

        this.items.push({
          adjective: this.adjectives[i],
          noun: this.nouns[i],
          image,
        })
      }

      // this.images.forEach(imageQuery => {
      //   this.fetchImage(imageQuery)
      // })
    },
    toggleActive(event) {
      // remove all active classes
      this.$refs.article.forEach(article => {
        article.classList.remove('is-active')
      })

      // activate this one
      event.target.classList.toggle('is-active')
      // event.target.addEventListener('transitionend', ev => {
      //   // scroll into view
      //   event.target.scrollIntoView({
      //     behavior: 'smooth',
      //   })
      // })
    },
  },
}
</script>

<style lang="scss" scoped>
article {
  margin: 0;
  text-align: center;

  figure {
    transition: max-height 500ms ease-in-out;
    max-height: 0;
    overflow: hidden;
  }

  &.is-active figure {
    max-height: 100vh;
  }

  img {
    transition: opacity 500ms ease-in-out;
    margin: 0 auto;
    opacity: 0;
  }
  &.is-active img {
    opacity: 1;
  }
}

header {
  pointer-events: none;
}

h2 {
  font-size: 10vw;
  font-family: 'FranklinGothic-ExtraCond';
  pointer-events: none;

  span:first-child {
    text-transform: capitalize;
  }
  span:last-child {
    text-transform: uppercase;
  }
}
</style>
