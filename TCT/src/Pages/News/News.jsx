import React from "react";

function News() {
    return (
        <><h1>News</h1>
            <div className="news-page">
                <main className="news-main">
                    <section className="news-articles">
                        <article className="news-article">
                            <h3>Latest Set</h3>
                            <p>New set release date</p>
                            <a className="button">Read more</a>
                        </article>
                        <article className="news=article">
                            <h3>Japan News</h3>
                            <p>Latest news from Japan</p>
                            <a className="button">Read More</a>
                        </article>
                        <article className="news-article">
                            <h3>Article 3</h3>
                            <p></p>
                            <a className="button">Read More</a>
                        </article>
                    </section>
                </main>
            </div></>
    )
}

export default News;