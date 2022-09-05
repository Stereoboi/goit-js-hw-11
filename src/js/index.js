import ImageApiService from './api-service'
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from 'notiflix';
import throttle from "lodash.throttle";

const gallery = new SimpleLightbox('.gallery a', {
    scrollZoom: true,
    captions: true,
    captionsData: "alt",
    captionPosition: "bottom",
    captionDelay: 250,
 });

const refs = {
    searchForm: document.querySelector('.search-form'),
    galleryRef: document.querySelector('.gallery'),
    // loadMoreBtn: document.querySelector('[data-action="load-more"]'),
    gallerySet: document.querySelector('.photo-card')  
} 


refs.searchForm.addEventListener('submit', onSearch);
// refs.loadMoreBtn.addEventListener('click', onLoadMore);

const apiService = new ImageApiService();

 function onSearch(event) {
    event.preventDefault();
    apiService.query = event.currentTarget.elements.searchQuery.value;
    apiService.resetPage();
    clearPageAfterNewSearchTitle();
    apiService.fetchImages().then(renderImageCard);
    apiService.fetchImages().then(totalHitsNotification);
}

 function totalHitsNotification(response) {
   if (response.data.totalHits === 0) {
    return
   }
   Notiflix.Notify.info(`Hooray! We found ${response.data.totalHits} images.`);
  
}

async function onLoadMore() {
  await apiService.incrementPage();
  await apiService.fetchImages().then(renderImageCard);
  gallery.refresh();
}

function renderImageCard(response) {
  
  if (response === undefined) {
    return
  }

  if (response.data.totalHits === 0) {
    Notiflix.Notify.failure(`Sorry, there are no images matching your search query. Please try again.`);
    return
  }
  // if (response.data.status === 400) {
  //   Notiflix.Notify.failure(`We're sorry, but you've reached the end of search results.`);
  //   console.clear();
  //   return
  // }
  const apiResponse = response.data.hits
  const imgCard = apiResponse.map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
      return `
    <div class="photo-card">
        <a  href="${largeImageURL}"><img class="photo-url" src="${webformatURL}" alt="${tags}" loading="lazy"/></a>
    <div class="info">
      <p class="info-item">
        <b>Likes:</b>
        <span>${likes}</span> 
      </p>
      <p class="info-item">
        <b>Views:</b>
        <span>${views}</span> 
      </p>
      <p class="info-item">
        <b>Comments:</b>
        <span>${comments}</span>
      </p>
      <p class="info-item">
        <b>Downloads:</b>
        <span>${downloads}</span>
      </p>
    </div>
  </div>
    `;}).join('');
  refs.galleryRef.insertAdjacentHTML('beforeend', imgCard);
  gallery.refresh();
}

function clearPageAfterNewSearchTitle() {
  refs.galleryRef.innerHTML = '';
}


// window.addEventListener('scroll', () => {
//   console.log('document.body.offsetHeight',document.body.offsetHeight);
//   console.log('yOffset',window.pageYOffset);
//   console.log('windowHeight',window.innerHeight);
//   let contentHeight = document.body.offsetHeight;
//   let yOffset = window.pageYOffset;
//   let windowHeight = window.innerHeight;
//   let y = yOffset + windowHeight;
//   if (y >= contentHeight) {
//     onLoadMore();
//     console.log('catch');
//   }
// });


window.addEventListener('scroll', throttle(infinityScroll, 250));

function infinityScroll() {
  
  const documentRect = document.documentElement.getBoundingClientRect()
  if (documentRect.bottom < document.documentElement.clientHeight + 1000) {
    onLoadMore();
    // console.log(documentRect.bottom);
    if (documentRect.bottom === document.documentElement.clientHeight) {
      Notiflix.Notify.failure(`We're sorry, but you've reached the end of search results.`);
      
    }
  }
}