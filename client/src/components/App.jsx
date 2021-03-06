import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import axios from "axios";
import { FcLike } from "react-icons/fc";
import $ from "jquery";
import Modal from "react-modal";
import L from "leaflet";
import jwt from 'jwt-decode';
import { renderToStaticMarkup } from "react-dom/server";
import { AiOutlineHeart, AiTwotoneHeart } from "react-icons/ai";
import moment from 'moment'

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      postOwner: "",
      currUser: "",
      coordinate: [37.773972, -122.431297],
      isOpen: false,
      isOpenComment: false,
      isSignUp: false,
      isLogin: false,
      isError: false,
      isSuccessLogin: false,
      isVisible: true,
      isClickImg: false,
      displayImg: "",
      errorMsg: "",
      successMsg: "",
      password: "",
      username: "",
      email:"",
      post: [],
      showMarker: false,
      comment: "",
      newPost: {
        owner: "",
        price: "",
        address: "",
        item: "",
        photos: [],
        description: "",
        condition: "Good",
      },
    };
    this.onSubmitHandler = this.onSubmitHandler.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.sendComment = this.sendComment.bind(this);
    this.createAccount = this.createAccount.bind(this);
    this.login = this.login.bind(this);
    this.onClickComment = this.onClickComment.bind(this);
    this.clickImg = this.clickImg.bind(this);
  }

  componentDidMount() {
    axios
      .get("/post")
      .then((res) => this.setState({ post: res.data }))
      .catch((err) => console.log(err));
      // console.log(jwt(document.cookie.slice(6)))
    if (document.cookie) {
      this.setState({
        currUser:jwt(document.cookie.slice(6)).username,
        isVisible: false,
      });
      this.setState({
        // isSuccessLogin: true,
        isVisible: false,
        isError: false,
        // successMsg: `Welcome, ${jwt(document.cookie.slice(6)).username}`,
      });
    }
  }

  clickImg(e) {
    this.setState({ isClickImg: true, displayImg: e.target.src });
  }
  closeModal() {
    this.setState({
      isOpen: false,
      isSignUp: false,
      isLogin: false,
      isError: false,
      isSuccessLogin: false,
      isClickImg: false,
      isOpenComment: false,
    });
  }
  onSubmitHandler(e) {
    e.preventDefault();
    console.log(this.state.newPost);
    axios.post("/post/new", this.state.newPost).then(() => {
      axios
        .get("/post")
        .then((res) => this.setState({ post: res.data }))
        .catch((err) => console.log(err));
    });
    this.closeModal();
  }
  onClickComment(id) {
    if (this.state.isVisible) {
      this.setState({ isError: true, errorMsg: "please login in" });
    } else {
      this.setState({
        isOpenComment: true,
        postOwner: id,
      });
    }
  }
  sendComment(e) {
    e.preventDefault();
    axios
      .post("/post/comment", {
        owner: this.state.postOwner,
        currUser: this.state.currUser,
        comment: this.state.comment,
      })
      .then(() => {
        axios
          .get("/post")
          .then((res) => this.setState({ post: res.data, comment: "" }))
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }
  login() {
    axios
      .post("/post/login", {
        email: this.state.email,
        password: this.state.password,
      })
      .then((res) => {
        if (res.data === "incorrect") {
          this.setState({
            isError: true,
            errorMsg: "incorrect username or password",
          });
        } else {
          document.cookie = `token=${res.data}`;
          this.setState({
            isSuccessLogin: true,
            isVisible: false,
            isError: false,
            successMsg: `Welcome,${jwt(document.cookie.slice(6)).username}`,
            currUser:jwt(document.cookie.slice(6)).username
          });
        }
      });
    this.closeModal();
  }

  createAccount() {
    axios
      .post("/post/signup", {
        username: this.state.username,
        email:this.state.email,
        password: this.state.password,
      })
      .then((res) => {
        if (res.data === "exist") {
          this.setState({ isError: true, errorMsg: "account exist" });
        } else {
          document.cookie = `token=${res.data}`;
          this.setState({
            isSuccessLogin: true,
            isVisible: false,
            isError: false,
            successMsg: `Welcome,${jwt(document.cookie.slice(6)).username} `,
            currUser:jwt(document.cookie.slice(6)).username
          });
        }
      });
    this.closeModal();
  }

  onChangeHandler(e) {
    e.preventDefault();
    const val = e.target.value;
    if (e.target.name === "comment") {
      this.setState({ comment: val });
    } else if (e.target.name === "username" || e.target.name === "password" || e.target.name === "email") {
      this.setState({ [e.target.name]: val });
    } else if (e.target.name === "photos") {
      const res = e.target.value.split(", ");
      const obj = this.state.newPost;
      const key = e.target.name;
      obj[key] = res;
      this.setState({ newPost: obj });
    } else {
      const obj = this.state.newPost;
      const key = e.target.name;
      obj[key] = val;
      this.setState({ newPost: obj });
    }
  }

  render() {
    const customStyles = {
      content: {
        top: "50%",
        left: "50%",
        right: "50%",
        bottom: "auto",
        maxHeight: "85%",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        boxShadow: "10px 5px 5px grey",
        borderRadius: "12px",
      },
    };
    const {
      coordinate,
      post,
      isOpenComment,
      isOpen,
      isSignUp,
      isLogin,
      isError,
      isSuccessLogin,
      successMsg,
      isVisible,
      isClickImg,
    } = this.state;
    const freeIcon = L.icon({
      iconUrl:
        "https://img.icons8.com/external-wanicon-lineal-color-wanicon/64/000000/external-free-marketing-strategy-wanicon-lineal-color-wanicon.png",
      iconSize: new L.Point(40, 40),
    });
    const newIcon = L.icon({
      iconUrl: "https://img.icons8.com/doodle/48/000000/new--v1.png",
      iconSize: new L.Point(40, 40),
    });
    const toyIcon = L.icon({
      iconUrl: "https://img.icons8.com/doodle/48/000000/brick.png",
      iconSize: new L.Point(40, 40),
    });
    return (
      <div>
        <div className="buttons">
          <div className="filter">
            <select>
              <option>Within 25 miles</option>
              <option>Within 50 miles</option>
              <option>Within 100 miles</option>
              <option>Any distance</option>
            </select>
            <select>
              <option>Anything</option>
              <option>Electronic</option>
              <option>home/kitchen</option>
              <option>Toys</option>
            </select>
            <select>
              <option>Free</option>
              <option>under $10</option>
              <option>under $50</option>
              <option>under $100</option>
              <option>Any</option>
            </select>
            <select>
              <option>In 3 days</option>
              <option>In 1 week</option>
              <option>In 1 month</option>
              <option>In 3 month</option>
              <option>Any</option>
            </select>
          </div>
          <div className="navbar_right">
            {isVisible && (
              <button onClick={() => this.setState({ isLogin: true })}>
                log in
              </button>
            )}
            {isVisible && (
              <button onClick={() => this.setState({ isSignUp: true })}>
                sign up
              </button>
            )}

            {!isVisible && (
              <div className="post">
                <div>
                  <AiOutlineHeart />
                </div>
                <button>My Post</button>
                <button onClick={() => this.setState({ isOpen: true })}>
                  Make a Post
                </button>
              </div>
            )}
            {!isVisible && (
              <span id="welcome">Welcome, {this.state.currUser} </span>
            )}
          </div>
        </div>

        <MapContainer
          center={coordinate}
          zoom={11}
          scrollWheelZoom={false}
          style={{ zIndex: 0 }}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {post.length > 0 &&
            post.map((p,i) => {
              return (
                <div className="marker" key={p._id}>
                  <Marker
                    key={p.postID}
                    position={[p.latitude, p.longitude]}
                    icon={[newIcon,freeIcon,toyIcon][i%3]}
                  >
                    <Popup
                      onClose={() => this.setState({ isOpenComment: false })}
                    >
                      <div>
                        <div>
                          {p.photos.length > 0 &&
                            p.photos.map((pic) => {
                              return (
                                <img
                                  key={pic}
                                  src={pic}
                                  height="60"
                                  width="80"
                                  onClick={this.clickImg}
                                />
                              );
                            })}
                        </div>
                        <h3>{p.item}</h3>
                        <h1>
                          {"$ "}
                          {p.price}
                        </h1>
                        <h5>
                          Description:
                          <div className="description">{p.description}</div>
                        </h5>

                        <h5>
                          {new Date(Number(p.dateCreated)).toLocaleString(
                            "en-CA"
                          )}
                        </h5>
                        <h5>Condition: {p.condition}</h5>
                        <h5>Status: {p.status}</h5>
                      </div>
                      <div className="btn">
                        {!isOpenComment && (
                          <button onClick={() => this.onClickComment(p.postID)}>
                            comment
                          </button>
                        )}
                      </div>
                      {isOpenComment && p.comment.length > 0 && (
                        <div>
                          {p.comment.map((c) => {
                            return (
                              <div key={c._id} className="comment_box">
                                <div className="comment_header">
                                  <span id="comment_name">{c.asker}:</span>
                                  <span id="comment_date">
                                    {moment(new Date(
                                      Number(c.dateCreated)
                                    ).toLocaleString()).fromNow()}
                                  </span>
                                </div>
                                <div className="comment">{c.comment}</div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      {isOpenComment && (
                        <form>
                          <input
                            type="text"
                            placeholder="comment..."
                            name="comment"
                            value={this.state.comment}
                            onChange={this.onChangeHandler}
                          />
                          <div className="btn">
                            <button type="submit" onClick={this.sendComment}>
                              send
                            </button>
                          </div>
                        </form>
                      )}
                    </Popup>
                  </Marker>
                </div>
              );
            })}
        </MapContainer>

        <Modal
          isOpen={isError}
          // onAfterOpen={afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          ariaHideApp={false}
        >
          <div>{this.state.errorMsg}</div>
        </Modal>
        <Modal
          isOpen={isClickImg}
          // onAfterOpen={afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          ariaHideApp={false}
        >
          <img
            src={this.state.displayImg}
            style={{
              height: "auto",
              width: "auto",
              maxHeight: "100%",
              maxWidth: "100%",
              overflow: "hidden",
              backgroundSize: "contain",
            }}
          />
        </Modal>
        <Modal
          isOpen={isSuccessLogin}
          // onAfterOpen={afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          ariaHideApp={false}
        >
          <div className="content">{this.state.successMsg}</div>
        </Modal>
        <Modal
          isOpen={isLogin}
          // onAfterOpen={afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          ariaHideApp={false}
        >
          <form>
            <h1 className="content">Login in</h1>
            <b>Email:</b>
            <input
              type="text"
              name="email"
              onChange={this.onChangeHandler}
            />
            <b>Password:</b>
            <input
              type="password"
              name="password"
              onChange={this.onChangeHandler}
            />
            <div className="btn">
              <button type="button" onClick={this.login}>
                login
              </button>
            </div>
          </form>
        </Modal>
        <Modal
          isOpen={isSignUp}
          // onAfterOpen={afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          ariaHideApp={false}
        >
          <form>
            <h1 className="content">Create Account</h1>
            <b>Username:</b>
            <input
              type="text"
              name="username"
              onChange={this.onChangeHandler}
            />
            <b>Email:</b>
            <input
              type="text"
              name="email"
              onChange={this.onChangeHandler}
            />
            <b>Password:</b>
            <input
              type="password"
              name="password"
              onChange={this.onChangeHandler}
            />
            <div className="btn">
              <button type="button" onClick={this.createAccount}>
                submit
              </button>
            </div>
          </form>
        </Modal>
        <Modal
          isOpen={isOpen}
          // onAfterOpen={afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          ariaHideApp={false}
        >
          <form onSubmit={this.onSubmitHandler}>
            <h1 className="content">Write my post</h1>
            <b>Item:</b>
            <input type="text" name="item" onChange={this.onChangeHandler} />
            <b>Owner:</b>
            <input type="text" name="owner" onChange={this.onChangeHandler} />
            <b>Price:</b>
            <input type="text" name="price" onChange={this.onChangeHandler} />
            <b>Condition:</b>
            <select name="condition" onChange={this.onChangeHandler}>
              <option>Good</option>
              <option>Used(normal wear)</option>
              <option>Bad</option>
            </select>
            <b>Photos:</b>
            <input type="text" name="photos" onChange={this.onChangeHandler} />
            <b> Description:</b>
            <textarea
              type="text"
              name="description"
              onChange={this.onChangeHandler}
              rows="2"
            />
            <b>Address:</b>
            <input type="type" name="address" onChange={this.onChangeHandler} />
            <div className="btn">
              <button type="submit">submit</button>
            </div>
          </form>
        </Modal>
      </div>
    );
  }
}

export default App;
