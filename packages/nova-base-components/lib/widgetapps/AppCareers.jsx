import React, {PropTypes, Component} from 'react';

class AppCareers extends Component {

    render() {

        return (
          <div className="constraintWidth_ZyYbM container_3aBgK">
              <section>
                  <h1 className="s-h1 m-centered">
                      Careers
                  </h1>
                  <p className="s-p">
                      Politicl is a news aggregator that puts together high quality opinion pieces from well reputed sources across the internet.
                  </p>
                  <p className="s-p">
                      These opinion pieces include editorials, op-eds and analysis of current affairs. Such articles help in creating context for significant events and convey the expert and non expert perspective on such affairs, e.g., strategies for countering terrorism, or analysis of opposition demands in Parliament, or the strategic objectives of the state visit to Saudi
                      Arabia. Politicl is an aggregator of such opinions.
                  </p>
                  <p className="s-p">
                      Our objective is to bring together the diverse views on various issues, so that our readers can develop a comprehensive understanding of issues of political significance. Because we believe that a healthy democracy begins with an informed citizenry. Or simply put, knowledge is power.
                  </p>
              </section>
              <Telescope.components.AppFooter/>
          </div>
        )
    }

}

AppCareers.displayName = "AppCareers";

module.exports = AppCareers;
