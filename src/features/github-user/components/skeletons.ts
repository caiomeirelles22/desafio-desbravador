export function createUserProfileSkeletonMarkup(): string {
  return `
    <section class="user-profile-card loading-card" aria-hidden="true">
      <div class="user-profile-header">
        <div class="loading-avatar"></div>
        <div class="loading-stack">
          <span class="loading-line loading-line--title"></span>
          <span class="loading-line loading-line--medium"></span>
        </div>
      </div>
      <div class="loading-stack">
        <span class="loading-line"></span>
        <span class="loading-line loading-line--medium"></span>
      </div>
      <div class="loading-profile-stats">
        ${createLoadingStatMarkup()}
        ${createLoadingStatMarkup()}
        ${createLoadingStatMarkup()}
        ${createLoadingStatMarkup()}
      </div>
      <div class="loading-stack">
        <span class="loading-line"></span>
        <span class="loading-line loading-line--short"></span>
      </div>
    </section>
  `
}

export function createRepositoryListSkeletonMarkup(count = 3): string {
  let cardsMarkup = ''

  for (let index = 0; index < count; index += 1) {
    cardsMarkup += `
      <article class="repository-card loading-card" aria-hidden="true">
        <div class="loading-stack">
          <span class="loading-line loading-line--title"></span>
          <span class="loading-line loading-line--medium"></span>
          <span class="loading-line"></span>
          <span class="loading-line loading-line--short"></span>
        </div>
      </article>
    `
  }

  return `
    <div class="repository-list">
      ${cardsMarkup}
    </div>
  `
}

export function createRepositoryDetailsSkeletonMarkup(): string {
  return `
    <section class="repository-main-card loading-card" aria-hidden="true">
      <div class="loading-stack">
        <span class="loading-line loading-line--short"></span>
        <span class="loading-line loading-line--title"></span>
        <span class="loading-line loading-line--medium"></span>
        <span class="loading-line"></span>
        <span class="loading-line"></span>
      </div>
      <div class="repository-metrics-grid">
        ${createLoadingMetricMarkup()}
        ${createLoadingMetricMarkup()}
        ${createLoadingMetricMarkup()}
        ${createLoadingMetricMarkup()}
      </div>
      <div class="repository-info-grid">
        ${createLoadingInfoMarkup()}
        ${createLoadingInfoMarkup()}
        ${createLoadingInfoMarkup()}
        ${createLoadingInfoMarkup()}
      </div>
    </section>
  `
}

export function createRepositorySidebarSkeletonMarkup(): string {
  return `
    <aside class="repository-sidebar-card loading-card" aria-hidden="true">
      <div class="loading-stack">
        <span class="loading-line loading-line--title"></span>
        <span class="loading-line"></span>
        <span class="loading-line loading-line--medium"></span>
      </div>
      <div class="loading-stack">
        <span class="loading-line"></span>
        <span class="loading-line"></span>
        <span class="loading-line loading-line--short"></span>
      </div>
    </aside>
  `
}

function createLoadingStatMarkup(): string {
  return `
    <div class="loading-stat">
      <span class="loading-line loading-line--short"></span>
      <span class="loading-line loading-line--medium"></span>
    </div>
  `
}

function createLoadingMetricMarkup(): string {
  return `
    <div class="repository-metric-card">
      <span class="loading-line loading-line--short"></span>
      <span class="loading-line loading-line--medium"></span>
    </div>
  `
}

function createLoadingInfoMarkup(): string {
  return `
    <div class="repository-info-card">
      <span class="loading-line loading-line--short"></span>
      <span class="loading-line"></span>
    </div>
  `
}
