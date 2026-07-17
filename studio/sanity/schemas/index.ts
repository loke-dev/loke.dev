import aboutPage from './aboutPage'
import author from './author'
import blogPage from './blogPage'
import callout from './callout'
import code from './code'
import contactPage from './contactPage'
import diagram from './diagram'
import homePage from './homePage'
import post from './post'
import project from './project'
import projectsPage from './projectsPage'
import redirect from './redirect'
import topic from './topic'

export const schemaTypes = [
  // Content types
  post,
  author,
  topic,
  redirect,
  project,
  // Page singletons
  homePage,
  aboutPage,
  blogPage,
  projectsPage,
  contactPage,
  // Block types
  code,
  callout,
  diagram,
]
