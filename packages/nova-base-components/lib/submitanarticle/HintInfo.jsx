import React, {PropTypes, Component} from 'react';

class HintInfo extends Component {
    constructor(props) {
        super(props);
        const titles = {
            link: "Link",
            title: "Title",
            body: "Description",
            categories: "Categories",
            topics: "Topics",
            status: "Status",
            thumbnail: "Featured Image",
            gallery: "Gallery"
        };
        this.state = this.initialState = {
            titles: titles,
            hintTop: 70
        };
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll.bind(this));
    }

    handleScroll(event) {
        let scrollTop = event.srcElement.body.scrollTop,
          itemTranslate = Math.min(70, scrollTop / 50);

        console.log("scrollTop: " + scrollTop + " itemTranslate: " + itemTranslate);

        this.setState({
            hintTop: 70 + scrollTop
        });
    }

    renderDetail() {
        switch (this.props.hintKey) {
            case "link":
                return (
                  <span>
                      <p>Have an interesting article to share? Paste the URL here</p>
                  </span>
                );
            case "title":
                return (
                  <span>
                      <p>Main Headline of the article.</p>
                  </span>
                );
            case "body":
                return (
                  <span>
                      <p>Please provide a brief description of the article. Make it interesting so that more people would be curious to see it..</p>
                  </span>
                );

            case "categories":
                return (
                  <span>
                      <p>
                          Select which category you’d like to post this in, e.g., Politics, Economy, Foreign Affairs.
                      </p>
                  </span>
                );
            case "topics":
                return (
                  <span>
                      <p>
                          Topics Add relevant topics to make your article more discoverable
                      </p>
                      <p>
                          E.g., Is your article about Narendra Modi? Add the topic “Narendra Modi” to it.
                      </p>
                      <p>
                          For multiple topics, use comma (,) to separate. E.g., Narendra Modi, Parliament, Rahul Gandhi.
                      </p>
                  </span>
                );
            case "status":
                return (
                  <span>
                      <p>Only admin have permission to approve the post's status.</p>
                  </span>
                );
            case "thumbnail":
                return (
                  <span>
                      <p>Featured Images are displayed as a square. Avoid text if possible.</p>
                      <p>Recommended size: 600 x 600px or bigger. If you are uploading a GIF, ensure it is under 3MB.</p>
                  </span>
                );
            case "gallery":
                return (
                  <span>
                      <p>Add two or more images or videos to better show off what you’re posting.</p>
                  </span>
                )
        }

    }

    render() {
        const {hintKey} = this.props,
          {titles, hintTop} = this.state,
          title = titles[hintKey];
        return (
          <div className="help_doWdD" style={{top: hintTop}}>
              <div className="title_39OLs boldText_3B8fa text_3Wjo0 default_tBeAo base_3CbW2">{title}</div>
              <span className="description_16FZG text_3Wjo0 subtle_1BWOT base_3CbW2">
                  {this.renderDetail()}
              </span>
          </div>
        );
    }
}

module.exports = HintInfo;
export default HintInfo;
