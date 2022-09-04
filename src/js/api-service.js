const axios = require('axios').default;
import Notiflix from 'notiflix';

    const API_KEY = '29643507-3b76bc967b8b60a450e09af03'
    const BASE_URL = 'https://pixabay.com/api/'

 
export default class ImageApiService {
   
    constructor() {
        this.searchQuery = '';
        this.page = 1;
    }
    
     async fetchImages() {
        
        const url = `${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&safesearch=true&orientation=horizontal&page=${this.page}&per_page=40`;

         try {
            const response = await axios.get(url);
            // console.log(response.data);
            this.incrementPage();
            return response
        }
         catch (error) {
             Notiflix.Notify.failure(`We're sorry, but you've reached the end of search results.`);
             console.clear();
             return
        }
         
    }

    incrementPage() {
        this.page += 1;
    }

    resetPage() {
        this.page = 1;
    }

    get query() {
        return this.searchQuery;  
    }

    set query (newQuery) {
        this.searchQuery = newQuery
    }
}