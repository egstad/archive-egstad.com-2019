import Prismic from 'prismic-javascript'
import { initApi } from '@/prismic-config'

export const state = () => ({
  collection: [],
  pagination: {
    // start at 0
    page: 0,
    // results always at least have 1
    total_pages: 1,
    results_per_page: 5,
    results_size: null,
    total_results_size: null,
  },
})

export const mutations = {
  updatePagination(state, val) {
    state.pagination.page = val.page
    state.pagination.results_per_page = val.results_per_page
    state.pagination.results_size = val.results_size
    state.pagination.total_pages = val.total_pages
    state.pagination.total_results_size = val.total_results_size
  },
  addProjectsToStore(state, val) {
    for (const project of val) {
      state.collection.push(project)
    }
  },
}

export const actions = {
  fetchProjects(context) {
    if (context.state.pagination.page < context.state.pagination.total_pages) {
      getNextPageFromPrismic(context)
    }
  },
}

/* ==========================================================================
   Real Code!
   ========================================================================== */

const getNextPageFromPrismic = context => {
  initApi().then(api => {
    return api
      .query(Prismic.Predicates.at('document.type', 'projects_single'), {
        page: context.state.pagination.page + 1,
        pageSize: context.state.pagination.results_per_page,
        orderings: '[document.first_publication_date]',
      })
      .then(response => {
        const updatedPagination = {
          page: response.page,
          results_per_page: response.results_per_page,
          results_size: response.results_size,
          total_pages: response.total_pages,
          total_results_size: response.total_results_size,
        }

        const newProjects = () => {
          return response.results
        }

        // update pagination data
        // this data helps us fetch the right number of projects
        context.commit('updatePagination', updatedPagination)
        // add new projects to store
        context.commit('addProjectsToStore', newProjects())
        // tell projects component that the store has updated!
        if (process.client) {
          window.$app.$emit('projects::loaded')
        }
      })
  })
}
