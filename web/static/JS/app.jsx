const Link = ReactRouterDOM.Link;
const Route = ReactRouterDOM.Route;
const Router = ReactRouterDOM.BrowserRouter;
const Switch = ReactRouterDOM.Switch;
const useParams = ReactRouterDOM.useParams;
const useContext = React.useContext;
const useState = React.useState;
const useEffect = React.useEffect;
const createContext = React.createContext;

// some general function
const setTitle = (e) => {
  document.title = "BACKSLASH - " + e.currentTarget.name;
};

const timeSince = (date) => {
  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years ago";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months ago";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours ago";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes ago";
  }
  return "just now";
};

const nFormatter = (num) => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, "") + "B";
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num;
};

// config marked
marked.setOptions({
  highlight: function (code) {
    return hljs.highlightAuto(code).value;
  },
});

const genColor = (id) => {
  const colors = [
    "red",
    "yellow",
    "orange",
    "amber",
    "lime",
    "green",
    "emerald",
    "teal",
    "cyan",
    "sky",
    "blue",
    "indigo",
    "violet",
    "purple",
    "fuchsia",
    "pink",
    "rose",
  ];
  const tuns = [400, 500, 700, 600, 800, 300];

  const randColor = colors[id % 17];
  const randTuns = tuns[id % 6];

  return `${randColor}-${randTuns}`;
};

const Loading = () => {
  return <p className="mt-8 text-center text-indigo-600">Loading...</p>;
};

const Auth = ({ page }) => {
  const [data, setData] = useContext(Context);

  const about = {
    "Sign-in": {
      url: "/accounts/sign-in",
      help: "create new account",
      helpurl: "/accounts/sign-up",
      about: "",
      apiurl: "/api/accounts/sign-in",
    },
    "Sign-up": {
      url: "/accounts/sign-up",
      help: "already have account",
      helpurl: "/accounts/sign-in",
      about: "",
      apiurl: "/api/accounts/sign-up",
    },
  };
  const [formData, setFormData] = useState({
    csrfmiddlewaretoken: data.csrfmiddlewaretoken,
  });
  const [status, setStatus] = useState(page);
  const [isLoading, setIsLoading] = useState(false);
  const year = new Date().getFullYear();
  const [messages, setMessages] = useState({});

  const manageData = (e) => {
    setMessages({});
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const hanldeClickHelpBtn = (e) => {
    setTitle(e);
    setIsLoading(false);
    setMessages({});
    if (status == "Sign-up") {
      setStatus("Sign-in");
    } else if (status == "Sign-in") {
      setStatus("Sign-up");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessages({});
    if (status === "Sign-up") {
      setIsLoading(true);
      $.ajax({
        method: "POST",
        url: about["Sign-up"]["apiurl"],
        data: formData,
        success: (r) => {
          setIsLoading(false);
          if (r.result) {
            document.location = "/";
          }
          setMessages(r);
        },
      });
    } else if (status === "Sign-in") {
      setIsLoading(true);
      $.ajax({
        method: "POST",
        url: about["Sign-in"]["apiurl"],
        data: formData,
        success: (r) => {
          setIsLoading(false);
          setMessages(r);
          if (r.result) {
            document.location = "/";
          }
        },
      });
    }
  };

  return (
    <main className="flex flex-col justify-between items-center w-full h-screen relative ">
      <span name="tmp"></span>
      <form
        className="p-4 flex items-center max-w-[20rem] min-w-[15rem] flex-col justify-center relative"
        method="POST"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-medium my-4">
          {status.replace(/\W+/g, " ")}
        </h1>
        {about[status]["about"] && (
          <p className="p2-1 pb-2 text-slate-600">{about[status]["about"]}</p>
        )}
        <div className="w-full my-1 text-lg flex flex-col">
          <input
            className="border-gray-300 border-b-2 py-1 placeholder:text-gray-600 w-full focus:border-gray-500 focus:placeholder:text-gray-700"
            type="text"
            maxLength="30"
            pattern="^(?!.*\.\.)(?!.*\.$)[^\W][a-z0-9_.]{2,29}$"
            name="username"
            placeholder="Username"
            onChange={manageData}
            required={true}
          />
          <span
            className={`text-sm text-red-500 pt-1 ${
              messages.username || messages.__all__
                ? "opacity-100"
                : "opacity-0"
            }`}
          >
            {messages.username ||
              messages.__all__ ||
              "Invalid username. e.g user.n_ame"}
          </span>
        </div>

        <div className="w-full my-1 text-lg flex flex-col">
          <input
            className="border-gray-300 border-b-2 py-1 placeholder:text-gray-600 w-full focus:border-gray-500 focus:placeholder:text-gray-700"
            type="password"
            name="password"
            placeholder="Password"
            pattern={status === "Sign-up" ? ".{8,}" : ".*"}
            onChange={manageData}
            required={true}
          />
          <span
            className={`text-sm ${
              status == "Sign-up" ? "text-red-500" : "text-white"
            } pt-1 ${messages.password2 ? "opacity-100" : "opacity-0"}`}
          >
            {messages.password2 ||
              (status == "Sign-up" ? "This password is too short." : "|")}
          </span>
        </div>

        {status == "Sign-up" ? (
          <div className="w-full my-1 text-lg flex flex-col">
            <input
              className="border-gray-300 border-b-2 py-1 placeholder:text-gray-600 w-full focus:border-gray-500 focus:placeholder:text-gray-700"
              type="email"
              name="email"
              placeholder="Email"
              onChange={manageData}
              required={true}
            />
            <span
              className={`text-sm text-red-500 pt-1 ${
                messages.email ? "opacity-100" : "opacity-0"
              }`}
            >
              {messages.email || "Invalid email. e.g email@exaple.com"}
            </span>
          </div>
        ) : (
          ""
        )}

        <button
          type="submit"
          className={`px-4 py-3 w-full mt-1 rounded-full active:scale-[0.98] transition-all flex items-center justify-center bg-gray-900 text-white font-semibold text-lg ${
            isLoading ? "opacity-50 cursor-wait" : ""
          }`}
        >
          {status.replace(/\W+/g, "") + (isLoading ? "..." : "")}
        </button>
        <Link
          name={status.replace(/\W+/g, " ")}
          onClick={hanldeClickHelpBtn}
          to={about[status]["helpurl"]}
          className={`w-full text-center pt-4 text-indigo-600 hover:text-indigo-500 cursor-pointer`}
        >
          {about[status]["help"]}
        </Link>
      </form>

      <span className="text-slate-600 py-4 text-sm opacity-100">
        {`© backslash.com ${year}. All right reserved.`}
      </span>
    </main>
  );
};

const Navbar = ({ state, loading }) => {
  const [data, setData] = useContext(Context);

  return (
    <nav
      className={`bg-white fixed ${
        state == "auth" ? "hidden" : "flex"
      } w-full h-16 border-t-2 bottom-0 border-gray-200 sm:left-0 sm:h-full sm:w-16 sm:border-r-2 sm:flex-col sm:justify-between`}
    >
      {loading ? (
        <div className="hidden sm:flex m-2 text-2xl items-center justify-center ">
          <i className="w-full aspect-square rounded-xl bg-gray-200 overflow-hidden fadeInLoad relative" />
        </div>
      ) : (
        <Link
          onClick={setTitle}
          name="Home"
          to="/"
          className="hidden sm:inline text-center text-3xl m-2 py-1 px-3 bg-black text-white rounded-xl font-bold"
        >
          \
        </Link>
      )}
      {loading ? (
        <div className="flex w-[83%] sm:w-full justify-around sm:justify-start sm:flex-col">
          <div className="m-3 text-2xl flex items-center justify-center ">
            <i className="h-full sm:w-full aspect-square rounded-xl bg-gray-200 overflow-hidden fadeInLoad relative" />
          </div>

          <div className="m-3 text-2xl flex items-center justify-center ">
            <i className="h-full sm:w-full aspect-square rounded-xl bg-gray-200 overflow-hidden fadeInLoad relative" />
          </div>

          <div className="m-3 text-2xl flex items-center justify-center ">
            <i className="h-full sm:w-full aspect-square rounded-xl bg-gray-200 overflow-hidden fadeInLoad relative" />
          </div>
        </div>
      ) : (
        <div
          className={`flex w-${
            data.me.id ? "[83%]" : "full"
          } sm:w-full justify-around sm:justify-start sm:flex-col`}
        >
          <Link
            to="/"
            onClick={setTitle}
            name="Home"
            tooltip="Home"
            className={`px-4 m-2 text-2xl flex items-center justify-center cursor-pointer sm:after:absolute sm:after:left-[100%] sm:after:py-1 sm:after:px-2 sm:after:bg-gray-900 sm:after:rounded-lg sm:after:text-base sm:after:flex sm:after:items-center sm:after:justify-center sm:after:border-[1px] sm:after:border-gray-700 sm:after:text-white sm:after:opacity-0 sm:after:-translate-y-3 hover:sm:after:translate-y-0 hover:sm:after:opacity-100 hover:sm:after:transition-all sm:after:transition-none after:pointer-events-none sm:after:content-[attr(tooltip)] ${
              state == "Home" ? "text-gray-900" : "text-gray-500"
            }`}
          >
            <i className={`bi bi-house${state == "Home" ? "-fill" : ""}`}></i>
          </Link>

          <Link
            onClick={setTitle}
            name="Search"
            to="/search"
            tooltip="Search"
            className={`px-4 m-2 text-2xl flex items-center justify-center cursor-pointer sm:after:absolute sm:after:left-[100%] sm:after:py-1 sm:after:px-2 sm:after:bg-gray-900 sm:after:rounded-lg sm:after:text-base sm:after:flex sm:after:items-center sm:after:justify-center sm:after:border-[1px] sm:after:border-gray-700 sm:after:text-white sm:after:opacity-0 sm:after:-translate-y-3 hover:sm:after:translate-y-0 hover:sm:after:opacity-100 hover:sm:after:transition-all sm:after:transition-none after:pointer-events-none sm:after:content-[attr(tooltip)] ${
              state == "Search" ? "text-gray-900" : "text-gray-500"
            }`}
          >
            <i className="bi bi-search"></i>
          </Link>

          <Link
            name={data.me.id ? "Bookmarks" : ""}
            onClick={(e) =>
              data.setAlert(
                () => setTitle(e),
                data.me.id,
                "You are not logged in."
              )
            }
            to={data.me.id ? "/bookmarks" : ""}
            tooltip="Bookmarks"
            className={`px-4 m-2 text-2xl flex  items-center justify-center cursor-pointe sm:after:absolute sm:after:left-[100%] sm:after:py-1 sm:after:px-2 sm:after:bg-gray-900 sm:after:rounded-lg sm:after:text-base sm:after:flex sm:after:items-center sm:after:justify-center sm:after:border-[1px] sm:after:border-gray-700 sm:after:text-white sm:after:opacity-0 sm:after:-translate-y-3 hover:sm:after:translate-y-0 hover:sm:after:opacity-100 hover:sm:after:transition-all sm:after:transition-none after:pointer-events-none sm:after:content-[attr(tooltip)] ${
              state == "Bookmarks" ? "text-gray-900" : "text-gray-500"
            }`}
          >
            <i
              className={`bi bi-bookmarks${
                state == "Bookmarks" ? "-fill" : ""
              }`}
            ></i>
          </Link>

          <Link
            name={data.me.id ? "Write" : null}
            onClick={(e) =>
              data.setAlert(
                () => setTitle(e),
                data.me.id,
                "You are not logged in."
              )
            }
            to={data.me.id ? "/write" : null}
            tooltip="Write"
            className={`px-4 m-2 text-2xl hidden sm:flex  items-center justify-center cursor-pointe sm:after:absolute sm:after:left-[100%] sm:after:py-1 sm:after:px-2 sm:after:bg-gray-900 sm:after:rounded-lg sm:after:text-base sm:after:flex sm:after:items-center sm:after:justify-center sm:after:border-[1px] sm:after:border-gray-700 sm:after:text-white sm:after:opacity-0 sm:after:-translate-y-3 hover:sm:after:translate-y-0 hover:sm:after:opacity-100 hover:sm:after:transition-all sm:after:transition-none after:pointer-events-none sm:after:content-[attr(tooltip)] ${
              state == "Write" ? "text-gray-900" : "text-gray-500"
            }`}
          >
            <i
              className={`bi bi-plus-circle${state == "Write" ? "-fill" : ""}`}
            ></i>
          </Link>
          {data.me.id ? (
            <Link
              name="Settings"
              onClick={setTitle}
              to="/me/settings"
              tooltip="Settings"
              className={`px-4 m-2 text-2xl hidden sm:flex  items-center justify-center cursor-pointe sm:after:absolute sm:after:left-[100%] sm:after:py-1 sm:after:px-2 sm:after:bg-gray-900 sm:after:rounded-lg sm:after:text-base sm:after:flex sm:after:items-center sm:after:justify-center sm:after:border-[1px] sm:after:border-gray-700 sm:after:text-white sm:after:opacity-0 sm:after:-translate-y-3 hover:sm:after:translate-y-0 hover:sm:after:opacity-100 hover:sm:after:transition-all sm:after:transition-none after:pointer-events-none sm:after:content-[attr(tooltip)] ${
                state == "Settings" ? "text-gray-900" : "text-gray-500"
              }`}
            >
              <i
                className={`bi bi-gear${state == "Settings" ? "-fill" : ""}`}
              ></i>
            </Link>
          ) : (
            ""
          )}
        </div>
      )}
      {loading ? (
        <div className="flex items-center justify-center h-full sm:h-auto sm:w-full aspect-square ">
          <div className="m-3 w-full aspect-square rounded-full overflow-hidden bg-gray-200 relative fadeInLoad" />
        </div>
      ) : data.me.id ? (
        <Link
          name="Me"
          onClick={setTitle}
          to="/me"
          tooltip="Profile"
          className="flex items-center justify-center h-full sm:h-auto sm:w-full aspect-square sm:after:whitespace-pre sm:after:absolute sm:after:left-[100%] sm:after:py-1 sm:after:px-2 sm:after:bg-gray-900 sm:after:rounded-lg sm:after:text-base sm:after:flex sm:after:items-center sm:after:justify-center sm:after:border-[1px] sm:after:border-gray-700 sm:after:text-white sm:after:opacity-0 sm:after:-translate-y-3 hover:sm:after:translate-y-0 hover:sm:after:opacity-100 hover:sm:after:transition-all sm:after:transition-none after:pointer-events-none sm:after:content-[attr(tooltip)]"
        >
          <div
            className={`m-3 aspect-square rounded-full overflow-hidden border-2 ${
              state == "Me" ? "border-gray-900" : ""
            }`}
          >
            <img
              src={data.me.profile}
              alt={`${data.me.name}'s image`}
              className="w-full h-full cursor-pointer rounded-full border-2 border-white"
            />
          </div>
        </Link>
      ) : (
        <Link
          name="Sign in"
          onClick={setTitle}
          to="/accounts/sign-in"
          tooltip="Join us"
          className={`px-4 m-2 text-2xl hidden sm:flex  items-center justify-center cursor-pointe sm:after:whitespace-pre sm:after:absolute sm:after:left-[100%] sm:after:py-1 sm:after:px-2 sm:after:bg-gray-900 sm:after:rounded-lg sm:after:text-base sm:after:flex sm:after:items-center sm:after:justify-center sm:after:border-[1px] sm:after:border-gray-700 sm:after:text-white sm:after:opacity-0 sm:after:-translate-y-3 hover:sm:after:translate-y-0 hover:sm:after:opacity-100 hover:sm:after:transition-all sm:after:transition-none after:pointer-events-none sm:after:content-[attr(tooltip)]`}
        >
          <i className="bi bi-person"></i>
        </Link>
      )}
    </nav>
  );
};

const Header = ({ loading, state }) => {
  const [data, setData] = useContext(Context);

  const save = () => {
    // pass
  };

  return (
    <header
      className={`bg-white fixed sm:hidden ${
        state == "auth" ? "hidden" : "flex"
      } w-full h-16 border-b-2 top-0 border-gray-200 items-center justify-between z-10`}
    >
      {loading ? (
        <div className="h-8 w-28 text-xl mx-4 py-1 px-3 bg-gray-200  rounded-xl fadeInLoad overflow-hidden relative " />
      ) : (
        <Link
          to="/"
          name="Home"
          onClick={setTitle}
          className="text-xl mx-4 py-1 px-3 bg-black text-white rounded-xl font-extrabold"
        >
          BACKSLASH
        </Link>
      )}
      {loading ? (
        <div className="h-10 w-24 block px-8 py-2 bg-gray-200 text-white rounded-full mx-4 fadeInLoad overflow-hidden relative" />
      ) : !data.me.id ? (
        <Link
          name="Sign in"
          onClick={setTitle}
          to="/accounts/sign-in"
          className="block px-8 py-2 bg-gray-900 text-white rounded-full mx-4 cursor-pointer active:scale-[0.98] active:opacity-90 transition-all"
        >
          Join
        </Link>
      ) : state == "Write" ? (
        <button
          onClick={save}
          className="block px-8 py-2 bg-gray-900 text-white rounded-full mx-4 cursor-pointer active:scale-[0.98] active:opacity-90 transition-all"
        >
          Save
        </button>
      ) : state == "Me" ? (
        <Link
          onClick={setTitle}
          to="/me/settings"
          name="Settings"
          className="block px-8 py-2 bg-gray-900 text-white rounded-full mx-4 cursor-pointer active:scale-[0.98] active:opacity-90 transition-all"
        >
          Settings
        </Link>
      ) : (
        <Link
          onClick={setTitle}
          to="/write"
          name="Write"
          className="block px-8 py-2 bg-gray-900 text-white rounded-full mx-4 cursor-pointer active:scale-[0.98] active:opacity-90 transition-all"
        >
          Write
        </Link>
      )}
    </header>
  );
};

const Tag = ({ tag, loading = false }) => {
  if (loading) {
    return (
      <div className="fadeInLoad relative overflow-hidden rounded-full h-5 w-16 bg-gray-200 mr-2" />
    );
  } else {
    return (
      <Link
        name={`# ${tag.name}`}
        onClick={setTitle}
        to={`/t/${tag.slug}`}
        className={`mr-2 text-${genColor(tag.id)}`}
      >
        #<span className="text-gray-700">{tag.name}</span>
      </Link>
    );
  }
};

const Fallowing = ({ user, loading }) => {
  if (loading) {
    return (
      <div className="fadeInLoad relative rounded-full overflow-hidden w-12 h-12 bg-gray-200 mr-3" />
    );
  } else {
    return (
      <Link
        name={user.name}
        onClick={setTitle}
        to={`/@${user.username}`}
        className={`relative first:ml-0 mx-2 last:mr-0 ${
          user.haveNew
            ? "after:bg-indigo-600 after:border-2 after:border-white after:h-4 after:w-4 after:absolute after:bottom-0 after:right-0 after:rounded-full"
            : ""
        }`}
      >
        <div className="rounded-full overflow-hidden w-12 h-12">
          <img
            src={`${user.profile}`}
            alt={`${user.name}'s image`}
            className="w-full h-full cursor-pointer"
          />
        </div>
      </Link>
    );
  }

};

const Post = ({ post = {}, loading }) => {
  const [isBookmark, setIsBookmark] = useState(post.bookmark);
  const [data, setData] = useContext(Context);

  const bookmark = () => {
    data.setAlert(
      () => {
        setIsBookmark(!isBookmark);
      },
      data.me.id,
      "You are not logged in."
    );
  };

  return (
    <div className="my-2 py-2 first:mt-1">
      {loading ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center fadeInLoad overflow-hidden relative">
            <div className=" w-8 h-8 rounded-full bg-gray-200 " />
            <div className="ml-3 w-[15ch] sm:w-[25ch] lg:w-[50ch]  bg-gray-200 rounded-full h-4 " />
            <span className="text-gray-200 mx-1">•</span>
            <div className=" bg-gray-200 rounded-full h-4 w-[7ch] " />
            <span className="text-gray-200 mx-1 hidden sm:inline">•</span>
            <div className=" bg-gray-200 rounded-full h-4 w-[7ch] hidden sm:inline" />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={`${post.user.profile}`}
              alt={`${post.user.name}'s image`}
              className="w-8 h-8 rounded-full "
            />
            <Link
              name={post.user.name}
              onClick={setTitle}
              to={`/@${post.user.username}`}
              className="font-semibold ml-3 max-w-[15ch] sm:max-w-[25ch] lg:max-w-[50ch] truncate"
            >
              {post.user.name}
            </Link>
            <span className="text-gray-500 mx-1">•</span>
            <span className="text-gray-500 whitespace-pre">
              {timeSince(post.date)}
            </span>
            <span className="text-gray-500 mx-1 hidden sm:inline">•</span>
            <span className="text-gray-500 whitespace-pre hidden sm:inline">
              {Math.ceil(post.text.split(" ").length / 200)} min read
            </span>
          </div>
        </div>
      )}

      {loading ? (
        <div className="body mt-2 fadeInLoad overflow-hidden relative">
          <div className="h-4 font-bold w-10/12   bg-gray-200 rounded-full" />
          <div className="mt-3 h-3 w-full rounded-full bg-gray-200  overlfow-hidden" />
          <div className="mt-1 h-3 w-1/2 rounded-full bg-gray-200  overlfow-hidden" />
        </div>
      ) : (
        <div className="body mt-2">
          <h1 className="text-2xl font-bold w-10/12 truncate">
            <Link
              name={post.title}
              onClick={setTitle}
              to={`/@${post.user.username}/${post.slug}`}
            >
              {post.title}
            </Link>
          </h1>
          <p className="mt-1">{post.text.slice(0, 150)}...</p>
        </div>
      )}

      {loading ? (
        <div className="tags flex mt-3 items-center justify-between">
          <div className="relative flex items-center whitespace-pre w-9/12 overflow-hidden  ">
            {[1, 2, 3, 4].map(() => (
              <Tag loading={true} />
            ))}
          </div>
        </div>
      ) : (
        <div className="tags flex mt-3 items-center justify-between">
          <div className="relative flex items-center whitespace-pre w-9/12 overflow-hidden  after:bg-gradient-to-l after:from-white after:to-transparent after:right-0 after:absolute after:h-full after:w-6">
            {post.tags.map((tag) => (
              <Tag tag={tag} id={tag.id} />
            ))}
          </div>

          <div className="flex">
            <i
              onClick={bookmark}
              className={`bi bi-bookmark-${
                isBookmark ? "fill" : "plus"
              } p-1 cursor-pointer mx-1  `}
            ></i>
            <i className="bi bi-three-dots pr-0 p-1 cursor-pointer mx-1"></i>
          </div>
        </div>
      )}
    </div>
  );
};

const Home = ({}) => {
  const [posts, setPosts] = useState({ rec: [], fallowings: [], latests: [] });
  const [state, setState] = useState("rec");
  const [isReady, setIsReady] = useState(false);
  const [tags, setTags] = useState([]);
  const [fallowings, setFallowings] = useState([]);
  const [data, setData] = useContext(Context);
  useEffect(() => {
    // emulate give from server
    setData({...data,["me"]: tempuser});
    setTimeout(() => {
      setTags(temptags);
      setFallowings([tempminiuser]);
      setPosts({ ...posts, ["rec"]: [tempminipost] });
      setIsReady(true);
    }, 1000);
  }, [1]);

  return (
    <main>
      <main className="mt-16 mb-16 sm:m-0 sm:ml-16 flex items-center justify-center">
        {isReady ? (
          <section className="p-6 max-w-6xl w-full">
            <div className="flex items-center justify-start">
              <span className="text-gray-600 whitespace-pre">Tags:</span>
              <div className="overflow-auto ml-3 flex items-center whitespace-pre ">
                {tags.map((t) => (
                  <Tag tag={t} id={t.id} />
                ))}
              </div>
            </div>

            <div className="py-2 my-4 flex overflow-auto">
              {fallowings.map((u) => (
                <Fallowing user={u} id={u.id} />
              ))}
            </div>

            <div className="border-b-2 text-sm sm:text-base flex justify-between sm:block">
              <button
                onClick={() => setState("rec")}
                className={`transition-all py-2 px-3 translate-y-[2px] border-b-2 w-full sm:w-auto ${
                  state == "rec" ? "border-gray-900" : "opacity-[0.75]"
                }`}
              >
                Suggestions
              </button>
              <button
                onClick={() => setState("fallowings")}
                className={`transition-all py-2 px-3 translate-y-[2px] border-b-2 w-full sm:w-auto ${
                  state == "fallowings" ? "border-gray-900" : "opacity-[0.75]"
                }`}
              >
                Fallowings
              </button>
              <button
                onClick={() => setState("latests")}
                className={`transition-all py-2 px-3 translate-y-[2px] border-b-2 w-full sm:w-auto ${
                  state == "latests" ? "border-gray-900" : "opacity-[0.75]"
                }`}
              >
                latests
              </button>
            </div>
            <div>
              {state == "rec" &&
                posts.rec.map((p) => <Post post={p} id={p.id} />)}
              {state == "fallowings" &&
                posts.fallowings.map((p) => <Post post={p} id={p.id} />)}
              {state == "latests" &&
                posts.latests.map((p) => <Post post={p} id={p.id} />)}
            </div>
          </section>
        ) : (
          <section className="p-6 max-w-6xl w-full">
            <div className="flex items-center justify-start">
              <span className="text-gray-600 whitespace-pre">Tags:</span>
              <div className="overflow-hiden ml-3 flex items-center whitespace-pre ">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                  <Tag loading={true} id={i} />
                ))}
              </div>
            </div>

            <div className="py-2 my-4 flex overflow-hidden">
              {[1, 2, 3].map((i) => (
                <Fallowing loading={true} id={i} />
              ))}
            </div>

            <div className="border-b-2 text-sm sm:text-base flex justify-between sm:block">
              <button className="py-2 px-3 translate-y-[2px] border-b-2 w-full sm:w-auto">
                <div className="fadeInLoad relative rounded-full h-5 w-20 bg-gray-200" />
              </button>
              <button className="py-2 px-3 translate-y-[2px] border-b-2 w-full sm:w-auto">
                <div className="fadeInLoad relative rounded-full h-5 w-20 bg-gray-200" />
              </button>
              <button className="py-2 px-3 translate-y-[2px] border-b-2 w-full sm:w-auto">
                <div className="fadeInLoad relative rounded-full h-5 w-20 bg-gray-200" />
              </button>
            </div>
            <div>
              {[1, 2, 3, 4, 5].map((i) => (
                <Post loading={true} id={i} />
              ))}
            </div>
          </section>
        )}
      </main>
    </main>
  );
};

const TagView = ({}) => {
  const [tag, setTag] = useState(null);
  const [data, setData] = useContext(Context);
  const [isReady, setIsReady] = useState(false);
  const url = useParams();
  useEffect(() => {
    // emulate give from server
    setTimeout(() => {
      setTag({
        id: 54,
        name: "Python",
        fallowers: 14003,
        posts: [tempminipost],
      });
      setData({...data,["me"]: tempuser});
      setIsReady(true);
    }, 1000);
  }, [1]);

  const fallow = () => {
    data.setAlert(
      () => {
        // send to server
        setTag({ ...tag, ["fallowed"]: !tag.fallowed });
      },
      data.me.id,
      "You are not logged in."
    );
  };
  return (
    <main>
      {isReady ? (
        <main className="mt-16 mb-16 sm:m-0 sm:ml-16 flex items-center justify-center">
          <section className="p-6 max-w-6xl w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span
                  className={`text-${genColor(
                    tag.id
                  )} text-7xl sm:text-8xl mr-2 `}
                >
                  #
                </span>

                <div className="flex flex-col">
                  <h1 className="text-lg sm:text-xl ">{tag.name}</h1>
                  <span className="text-gray-500">
                    {nFormatter(tag.fallowers)} fallowers
                  </span>
                </div>
              </div>
              <button
                onClick={fallow}
                className={`py-1 px-3 rounded-full active:scale-[0.98] transition-all ${
                  tag.fallowed
                    ? "text-indigo-500 border-2 border-indigo-500 bg-white"
                    : "text-white bg-indigo-500"
                } `}
              >
                {tag.fallowed ? "Unfallow" : "Fallow"}
              </button>
            </div>

            <div className="mt-8 border-b-2 border-gray-400 flex ">
              <button className="py-2 px-3 border-b-2 border-gray-900 translate-y-[2px] ">
                Home
              </button>
            </div>
            <div className="posts">
              {tag.posts.map((p) => (
                <Post post={p} id={p.id} />
              ))}
            </div>
          </section>
        </main>
      ) : (
        <main className="mt-16 mb-16 sm:m-0 sm:ml-16 flex items-center justify-center">
          <section className="p-6 max-w-6xl w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center overflow-hidden relative fadeInLoad">
                <span className="text-gray-200 text-7xl sm:text-8xl mr-2 ">
                  #
                </span>
                <div>
                  <div className="h-5 bg-gray-200 rounded-full w-32" />
                  <div className="mt-1 h-4 bg-gray-200 rounded-full w-16" />
                </div>
              </div>
              <div className="py-1 px-3 rounded-full bg-gray-200 relative fadeInLoad overflow-hidden  w-20 h-8" />
            </div>

            <div className="tm-4 border-b-2 flex ">
              <button className="py-2 px-3 translate-y-[2px] border-b-2">
                <div className="fadeInLoad relative rounded-full h-5 w-20 bg-gray-200" />
              </button>
            </div>
            <div>
              {[1, 2, 3, 4, 5].map((i) => (
                <Post loading={true} id={i} />
              ))}
            </div>
          </section>
        </main>
      )}
    </main>
  );
};

const PeopleItem = ({ user = {}, inSearch, loading }) => {
  const [data, setData] = useContext(Context);
  const [fallowed, setFallowed] = useState(user.fallowed);

  const fallow = () => {
    data.setAlert(
      () => {
        // send to server
        setFallowed(!fallowed);
      },
      data.me.id,
      "You are not logged in."
    );
  };

  return (
    <div className="flex items-center justify-between px-2 py-1">
      {loading ? (
        <div className="flex items-center w-full overflow-hidden">
          <img className="h-12 w-12 rounded-full m-1 bg-gray-200" />
          <div className="flex flex-col p-1 w-full">
            <div className="w-3/4 h-4 bg-gray-200 rounded-full" />
            <div className="w-1/2 h-3 mt-1 bg-gray-200 rounded-full" />
          </div>
        </div>
      ) : (
        <Link
          name={user.name}
          onClick={setTitle}
          to={`/@${user.username}`}
          className="flex items-center w-full"
        >
          <img
            src={user.profile}
            alt={`${user.name}'s image`}
            className="h-14 w-14 sm:h-16 sm:w-16 rounded-full"
          />
          <div className="ml-2 w-full overflow-hidden">
            <h1 className="text-xl truncate">{user.name}</h1>
            <span className="text-gray-500 whitespace-pre">
              {inSearch ? nFormatter(user.fallowers) + " Fallowers" : user.bio}
            </span>
          </div>
        </Link>
      )}
      {loading ? (
        <div className="p-2 flex items-center">
          <div className="py-1 px-3 rounded-full bg-gray-200 relative fadeInLoad overflow-hidden  w-20 h-8" />
        </div>
      ) : (
        <button
          onClick={fallow}
          className={`py-1 px-3 mx-2 rounded-full active:scale-[0.98] transition-all border-2 border-indigo-500 ${
            fallowed ? "text-indigo-500 bg-white" : "text-white bg-indigo-500"
          } `}
        >
          {fallowed ? "Unfallow" : "Fallow"}
        </button>
      )}
    </div>
  );
};

const TagItem = ({ tag = {}, loading }) => {
  const [data, setData] = useContext(Context);
  const [fallowed, setFallowed] = useState(tag.fallowed);

  const fallow = () => {
    data.setAlert(
      () => {
        // send to server
        setFallowed(!fallowed);
      },
      data.me.id,
      "You are not logged in."
    );
  };

  return (
    <div className="flex justify-between items-center my-2">
      {loading ? (
        <div className="flex items-center w-full overflow-hidden relative fadeInLoad">
          <span className={`text-gray-200 text-6xl sm:text-7xl mr-2 `}>#</span>
          <div className="ml-2 w-full overflow-hidden">
            <div className="rounded-full bg-gray-200 h-4 w-3/4" />
            <div className="mt-1 rounded-full bg-gray-200 h-3 w-1/2" />
          </div>
        </div>
      ) : (
        <Link
          name={`# ${tag.name}`}
          onClick={setTitle}
          to={`/t/${tag.slug}`}
          className="flex items-center w-full"
        >
          <span
            className={`text-${genColor(tag.id)} text-6xl sm:text-7xl mr-2 `}
          >
            #
          </span>
          <div className="ml-2 w-full overflow-hidden">
            <h1 className="text-xl truncate">{tag.name}</h1>
            <span className="text-gray-500 whitespace-pre">
              {nFormatter(tag.fallowers)} Fallowers
            </span>
          </div>
        </Link>
      )}
      {loading ? (
        <div className="py-1 px-3 rounded-full bg-gray-200 relative fadeInLoad overflow-hidden  w-20 h-8" />
      ) : (
        <button
          onClick={fallow}
          className={`py-1 px-3 mx-2 rounded-full active:scale-[0.98] transition-all border-2 border-indigo-500 ${
            fallowed ? "text-indigo-500  bg-white" : "text-white bg-indigo-500"
          } `}
        >
          {fallowed ? "Unfallow" : "Fallow"}
        </button>
      )}
    </div>
  );
};

const SearchView = ({}) => {
  const [data, setData] = useContext(Context);
  const [state, setState] = useState("posts");
  const [result, setResult] = useState({
    tags: temptags,
    people: [],
    posts: [],
  });

  const search = (e) => {
    // send to server
    // const text = e.target.value;
  };
  useEffect(() => {
    // emulate give from server
    setData({...data,["me"]: tempuser});
  }, [1]);


  return (
    <main>
      <main className="mt-16 mb-16 sm:m-0 sm:ml-16 flex items-center justify-center">
        <section className="p-6 max-w-6xl w-full">
          <div className="rounded-full w-full flex border-2 border-gray-300  px-2 ">
            <i className="bi bi-search px-1 py-2 text-md sm:text-lg"></i>
            <input
              type="text"
              placeholder="Search"
              onChange={search}
              dir="auto"
              className="focus:border-0 focus:outline-0 text-lg sm:text-xl w-full mx-2"
            />
          </div>
          {result.posts.length +
          result.people.length +
          result.tags.length ? (
            <div>
              <div className="mt-8 border-b-2 text-sm sm:text-base flex justify-between sm:block">
                <button
                  onClick={() => setState("posts")}
                  className={`transition-all py-2 px-3 translate-y-[2px] border-b-2 w-full sm:w-auto ${
                    state == "posts" ? "border-gray-900" : "opacity-[0.75]"
                  }`}
                >
                  Posts
                </button>
                <button
                  onClick={() => setState("people")}
                  className={`transition-all py-2 px-3 translate-y-[2px] border-b-2 w-full sm:w-auto ${
                    state == "people" ? "border-gray-900" : "opacity-[0.75]"
                  }`}
                >
                  People
                </button>
                <button
                  onClick={() => setState("tags")}
                  className={`transition-all py-2 px-3 translate-y-[2px] border-b-2 w-full sm:w-auto ${
                    state == "tags" ? "border-gray-900" : "opacity-[0.75]"
                  }`}
                >
                  Tags
                </button>
              </div>
              <div>
                {state == "posts" &&
                  result.posts &&
                  result.posts.map((i) => <Post post={i} id={i.id} />)}
                {state == "people" &&
                  result.people &&
                  result.people.map((i) => <PeopleItem user={i} id={i.id} />)}
                {state == "tags" &&
                  result.tags &&
                  result.tags.map((i) => <TagItem tag={i} id={i.id} />)}
              </div>
            </div>
          ) : (
            ""
          )}
        </section>
      </main>
    </main>
  );
};

const BookmarkView = ({}) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [data, setData] = useContext(Context);
  useEffect(() => {
    // emulate give from server
    setData({...data,["me"]: tempuser});
    setTimeout(() => {
      setBookmarks([]);
      setIsReady(true);
    }, 1000);
  }, [1]);

  return (
    <main>
      <main className="mt-16 mb-16 sm:m-0 sm:ml-16 flex items-center justify-center">
        <section className="p-6 max-w-6xl w-full">
          <h1 className="text-3xl border-b-2 border-gray-300 mb-2 py-2">
            Bookmarks
          </h1>
          {isReady ? (
            <div>
              {bookmarks.map((p) => (
                <Post post={p} id={p.id} />
              ))}
            </div>
          ) : (
            <div>
              {[1, 2, 3, 4, 5].map((i) => (
                <Post loading={true} id={i} />
              ))}
            </div>
          )}
        </section>
      </main>
    </main>
  );
};

const WriteView = ({}) => {
  const [data, setData] = useContext(Context);
  const [post, setPost] = useState({});
  const [messages, setMessages] = useState({});
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    // emulate give from server
    setData({...data,["me"]: tempuser});
  }, [1]);

  const handleChange = (e) => {
    setPost({ ...post, ["date"]: new Date().getTime() });
    setPost({ ...post, [e.target.name]: e.target.value });
  };
  const handleUpload = () => {
    // pass
  };

  const save = () => {
    // pass
  };

  return (
    <main>
      <main className="mt-16 mb-16 sm:m-0 sm:ml-16 flex items-center justify-center">
        <section className="p-6 max-w-6xl w-full">
          <div className="flex items-center justify-between mb-5">
            <button className="relative px-4 py-1 border-2 border-gray-300 rounded-full cursor-pointer active:scale-[0.98] active:opacity-90 transition-all">
              Upload
              <input
                type="file"
                accept="image/*"
                onClick={handleUpload}
                className="cursor-pointer w-full h-full opacity-0 absolute right-0 bottom-0 z-[2]"
              />
            </button>
            <div className="flex">
              <button
                onClick={save}
                className="hidden sm:block px-4 py-1 bg-gray-900 text-white rounded-full mr-2 cursor-pointer active:scale-[0.98] active:opacity-90 transition-all"
              >
                Save
              </button>
              <button
                onClick={() => setIsPreview(!isPreview)}
                className="px-4 py-1 border-2 border-gray-300 rounded-full cursor-pointer active:scale-[0.98] active:opacity-90 transition-all"
              >
                {isPreview ? "Edit" : "Preview"}
              </button>
            </div>
          </div>
          {isPreview ? (
            <div>
              <div className="head flex items-center justify-between">
                <div className="flex items-center ">
                  <img
                    src={data.me.profile}
                    alt={`${data.me.name}'s image`}
                    className="w-12 h-12 rounded-full "
                  />

                  <div className="flex flex-col ml-3">
                    <h1 className="text-md sm:text-xl font-semibold max-w-[19ch] sm:max-w-[25ch] lg:max-w-[50ch] truncate">
                      {data.me.name}
                    </h1>
                    <div>
                      <span className="text-gray-500 whitespace-pre">
                        {timeSince(post.date)}
                      </span>
                      <span className="text-gray-500 mx-1">•</span>
                      <span className="text-gray-500 whitespace-pre">
                        {Math.ceil((post.text || "").split(" ").length / 200)}{" "}
                        min <span className="hidden sm:inline">read</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="tags flex mt-3 items-center justify-between">
                <div className="relative flex items-center whitespace-pre w-[calc(100%-1rem)] overflow-hidden  after:bg-gradient-to-l after:from-white after:to-transparent after:right-0 after:absolute after:h-full after:w-6">
                  {post.tags && post.tags.map((i) => <Tag tag={i} id={i.id} />)}
                </div>
              </div>

              <article
                className="post-body mt-2"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    marked.parse(
                      `# ${post.title || "Title"}\n` +
                        (post.text || "Post body")
                    )
                  ),
                }}
              />
            </div>
          ) : (
            <div className="write">
              <input
                defaultValue={post.title}
                className="text-2xl w-full"
                type="text"
                name="title"
                onChange={handleChange}
                placeholder="Title of the post"
              />
              <span
                className={`${
                  messages.text ? "text-red-500" : "text-gray-700"
                } text-sm`}
              >
                {messages.title ||
                  "Show on top of post and other people can find your post with it."}
              </span>

              <textarea
                dir="auto"
                defaultValue={post.text}
                onChange={handleChange}
                name="text"
                placeholder="Body of the post"
                className="mt-3 text-xl w-full h-[70vh] resize-none"
              ></textarea>
              <span
                className={`${
                  messages.text ? "text-red-500" : "text-gray-700"
                } text-sm`}
              >
                {messages.text || (
                  <span>
                    We use
                    <a
                      href="#markdown"
                      target="_blank"
                      className="text-indigo-800 mx-1"
                    >
                      markdown
                    </a>
                    to render your post body.
                  </span>
                )}
              </span>
            </div>
          )}
        </section>
      </main>
    </main>
  );
};

const MeView = ({}) => {
  const [data, setData] = useContext(Context);
  const [state, setState] = useState("drafts");
  const [showSide, setShowSide] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // emulate give from server
    setTimeout(() => {
      setIsReady(true);
      setData({...data,["me"]: tempuser});
    }, 1000);
  }, [1]);

  const closeSide = (e) => {
    if (e.target.id == "close") {
      setShowSide(null);
    }
  };

  const Container = ({ sideName }) => {
    const [isReady, setIsReady] = useState(false);
    const [items, setItems] = useState([]);

    useEffect(() => {
      // emulate give from server
      setTimeout(() => {
        if (sideName == "fallowers") {
          // get from server
          setItems([tempminiuser]);
        } else if (sideName == "fallowings") {
          // get from server
          setItems([tempminiuser]);
        } else {
          // get from server
          setItems(temptags);
        }
        setIsReady(true);
      }, 1000);
    }, [1]);

    return (
      <div
        id="close"
        onClick={closeSide}
        className={`bg-[#00000078] backdrop-blur-sm fixed w-screen h-screen right-0 top-0 flex flex-col-reverse sm:flex-row-reverse z-[90] `}
      >
        <div
          className={`${
            showSide == sideName
              ? "translate-0"
              : "translate-y-[100%] sm:translate-x-[100%] sm:translate-y-0"
          } transition-all border-2 border-gray-100 flex flex-col z-20 bg-white absolute rounded-tr-3xl rounded-tl-3xl w-full h-4/5 sm:rounded-tr-none sm:rounded-bl-3xl sm:h-full sm:w-[28rem]`}
        >
          <button
            id="close"
            className="p-2 w-full flex items-center justify-center sm:w-auto sm:h-full sm:left-0 sm:absolute"
          >
            <div className="rounded-full bg-gray-200 w-20 h-1 sm:h-20 sm:w-1"></div>
          </button>

          <div className="overflow-auto h-full sm:ml-4 px-2 pb-2">
            {isReady
              ? sideName == "tags"
                ? items.map((item) => <TagItem tag={item} id={item.id} />)
                : items.map((item) => <PeopleItem user={item} id={item.id} />)
              : sideName == "tags"
              ? [1, 2, 3, 4, 5, , 6, 7, 8, 9].map((item) => (
                  <TagItem loading={true} id={item.id} />
                ))
              : [1, 2, 3, 4, 5, , 6, 7, 8, 9].map((item) => (
                  <PeopleItem loading={true} id={item.id} />
                ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <main>
      <main className="mt-16 mb-16 sm:m-0 sm:ml-16 sm:flex items-center justify-center">
        {isReady ? (
          <section className="p-6 max-w-6xl w-full">
            <div className="flex justify-between items-center">
              <img
                src={data.me.profile}
                alt={`${data.me.name}'s image`}
                className="w-24 h-24 sm:h-36 sm:w-36 lg:h-46 lg:w-46 rounded-full"
              />

              <div className="flex w-full justify-around">
                <button
                  onClick={() => setShowSide("fallowers")}
                  className="flex flex-col sm:flex-row items-center"
                >
                  {nFormatter(data.me.fallowers)}
                  <span className="text-gray-500 sm:ml-2">Fallowers</span>
                </button>
                {showSide == "fallowers" ? (
                  <Container sideName="fallowers" />
                ) : (
                  ""
                )}
                <button
                  onClick={() => setShowSide("fallowings")}
                  className="flex flex-col sm:flex-row items-center"
                >
                  {nFormatter(data.me.fallowings)}
                  <span className="text-gray-500 sm:ml-2">Fallowings</span>
                </button>
                {showSide == "fallowings" ? (
                  <Container sideName="fallowings" />
                ) : (
                  ""
                )}
                <button
                  onClick={() => setShowSide("tags")}
                  className="flex flex-col sm:flex-row items-center"
                >
                  {nFormatter(data.me.tags)}
                  <span className="text-gray-500 sm:ml-2">Tags</span>
                </button>
                {showSide == "tags" ? <Container sideName="tags" /> : ""}
              </div>
            </div>
            <h1 className="py-1 text-2xl">{data.me.name}</h1>
            <p className=" text-gray-700">{data.me.bio}</p>

            <div className="mt-8 border-b-2 text-sm sm:text-base flex justify-between sm:block">
              <button
                onClick={() => setState("drafts")}
                className={`transition-all py-2 px-3 translate-y-[2px] border-b-2 w-full sm:w-auto ${
                  state == "drafts" ? "border-gray-900" : "opacity-[0.75]"
                }`}
              >
                Drafts {data.me.posts.filter((p) => p.status == "draft").length}
              </button>
              <button
                onClick={() => setState("pubs")}
                className={`transition-all py-2 px-3 translate-y-[2px] border-b-2 w-full sm:w-auto ${
                  state == "pubs" ? "border-gray-900" : "opacity-[0.75]"
                }`}
              >
                Publications{" "}
                {data.me.posts.filter((p) => p.status == "pub").length}
              </button>
            </div>
            <div className="posts">
              {state == "pubs" &&
                data.me.posts
                  .filter((i) => i.status == "pub")
                  .map((i) => <Post post={i} id={i.id} />)}
              {state == "drafts" &&
                data.me.posts
                  .filter((i) => i.status == "draft")
                  .map((i) => <Post post={i} id={i.id} />)}
            </div>
          </section>
        ) : (
          <section className="p-6 max-w-6xl w-full">
            <div className="flex justify-between items-center">
              <div className="w-28 h-28 sm:h-36 sm:w-36 lg:h-46 lg:w-46  rounded-full bg-gray-200 fadeInLoad overflow-hidden relative" />

              <div className="flex w-[60%] justify-around">
                <button className="flex flex-col sm:flex-row items-center">
                  <span className="text-gray-500 sm:ml-2">Fallowers</span>
                </button>

                <button className="flex flex-col sm:flex-row items-center">
                  <span className="text-gray-500 sm:ml-2">Fallowings</span>
                </button>

                <button className="flex flex-col sm:flex-row items-center">
                  <span className="text-gray-500 sm:ml-2">Tags</span>
                </button>
              </div>
            </div>
            <div className="mt-3 my-1 h-5 w-1/4 rounded-full bg-gray-200 fadeInLoad overflow-hidden relative" />
            <div className="mt-2 my-1 h-3 w-9/12 rounded-full bg-gray-200 fadeInLoad overflow-hidden relative" />
            <div className="my-1 h-3 w-1/2 rounded-full bg-gray-200 fadeInLoad overflow-hidden relative" />

            <div className="mt-8 border-b-2  flex justify-between sm:block">
              <button className="py-2 px-3 translate-y-[2px] border-b-2 w-full sm:w-auto">
                <div className="fadeInLoad relative rounded-full h-5 w-20 bg-gray-200" />
              </button>
              <button className="py-2 px-3 translate-y-[2px] border-b-2 w-full sm:w-auto">
                <div className="fadeInLoad relative rounded-full h-5 w-20 bg-gray-200" />
              </button>
            </div>
            <div className="posts">
              {[1, 2, 3, 4, 5].map((i) => (
                <Post loading={true} id={i} />
              ))}
            </div>
          </section>
        )}
      </main>
    </main>
  );
};

const PeopleView = ({}) => {
  const [data, setData] = useContext(Context);
  const [user, setUser] = useState({});
  const [isReady, setIsReady] = useState(false);
  const url = useParams();
  useEffect(() => {
    // emulate give from server
    setData({...data,["me"]: tempuser});
    setTimeout(() => {
      setUser(tempminiuser);
      setIsReady(true);
    }, 1000);
  }, [1]);

  const fallow = () => {
    data.setAlert(
      () => {
        // send to server
        setUser({ ...user, ["fallowed"]: !user.fallowed });
      },
      data.me.id,
      "You are not logged in."
    );
  };

  return (
    <main>
      {isReady ? (
        <main className="mt-16 mb-16 sm:m-0 sm:ml-16 flex items-center justify-center">
          <section className="p-6 max-w-6xl w-full">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <img
                  src={user.profile}
                  alt={`${user.name}'s image`}
                  className="h-14 w-14 sm:h-16 sm:w-16 rounded-full"
                />
                <div className=" ml-2 w-full overflow-hidden">
                  <h1 className="text-xl sm:text-2xl truncate">
                    {user.name}
                    <small className="text-gray-500 hidden sm:inline mx-1">
                      @{user.username}
                    </small>
                  </h1>
                  <span className="text-gray-500 whitespace-pre">
                    {nFormatter(user.fallowers)} Fallowers
                  </span>
                </div>
              </div>
              <button
                onClick={fallow}
                className={`py-1 px-3 mx-2 rounded-full active:scale-[0.98] transition-all border-2 border-indigo-500 ${
                  user.fallowed
                    ? "text-indigo-500  bg-white"
                    : "text-white bg-indigo-500"
                } `}
              >
                {user.fallowed ? "Unfallow" : "Fallow"}
              </button>
            </div>
            <p className="my-4">{user.bio}</p>
            <div className="mt-8 border-b-2 border-gray-400 flex ">
              <button className="py-2 px-3 border-b-2 border-gray-900 translate-y-[2px] opacity-90 ">
                Home
              </button>
            </div>
            <div className="posts">
              {user.posts.map((p) => (
                <Post post={p} id={p.id} />
              ))}
            </div>
          </section>
        </main>
      ) : (
        <main className="mt-16 mb-16 sm:m-0 sm:ml-16 flex items-center justify-center">
          <section className="p-6 max-w-6xl w-full">
            <div className="flex justify-between items-center fadeInLoad overflow-hidden relative ">
              <div className="flex items-center w-full">
                <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-gray-200" />
                <div className=" ml-2 w-4/5 overflow-hidden">
                  <div className="flex items-center">
                    <div className="h-5 bg-gray-200 rounded-full w-32" />
                    <div className="ml-1 h-4 bg-gray-200 rounded-full w-16" />
                  </div>
                  <div className="mt-1 h-4 bg-gray-200 rounded-full w-16" />
                </div>
              </div>
              <div className="py-1 px-3 rounded-full bg-gray-200 relative fadeInLoad overflow-hidden  w-20 h-8" />
            </div>

            <div className="mt-2 my-1 h-3 w-9/12 rounded-full bg-gray-200 fadeInLoad overflow-hidden relative" />
            <div className="my-1 h-3 w-1/2 rounded-full bg-gray-200 fadeInLoad overflow-hidden relative" />

            <div className="mt-8 border-b-2 flex ">
              <button className="py-2 px-3 translate-y-[2px] border-b-2">
                <div className="fadeInLoad relative rounded-full h-5 w-20 bg-gray-200" />
              </button>
            </div>
            <div className="posts">
              {[1, 2, 3, 4, 5].map(() => (
                <Post loading={true} />
              ))}
            </div>
          </section>
        </main>
      )}
    </main>
  );
};

const SettingsView = ({}) => {
  const [data, setData] = useContext(Context);
  const [editField, setEditField] = useState(null);
  const [messages, setMessages] = useState({});
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSide, setShowSide] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // emulate give from server
    setTimeout(() => {
      setIsReady(true);
      setData({...data,["me"]: tempuser});
    }, 1000);
  }, [1]);

  const Container = ({ sideName, title, about, btn, func }) => {
    return (
      <div
        id="close"
        onClick={closeSide}
        className={`${
          showSide == sideName
            ? "bg-[#00000078]"
            : "pointer-events-none opacity-0"
        } fixed flex h-screen items-center justify-center right-0 top-0 w-screen z-10 transition-all backdrop-blur-sm`}
      >
        <div
          className={`bg-white rounded-xl w-2/3 max-w-lg transition-all ${
            !showSide == sideName ? "scale-75 opacity-0" : ""
          }`}
        >
          <h1 className="text-xl px-6 pt-4">{title}</h1>
          <p className="px-6 py-4 text-gray-700">{about}</p>

          {showSide == "delete" ? (
            <div className="w-full my-1 text-lg flex flex-col px-6 py-2">
              <input
                className="border-gray-300 border-b-2 py-1 placeholder:text-gray-600 w-full focus:border-gray-500 focus:placeholder:text-gray-700"
                type="password"
                name="password"
                placeholder="Current password"
                // onChange={manageData}
                required={true}
              />
              <span
                className={`text-sm text-red-500 pt-1 ${
                  messages.password ? "opacity-100" : "opacity-0"
                }`}
              >
                {messages.password}
              </span>
            </div>
          ) : (
            ""
          )}

          <div className="flex flex-col">
            <button
              onClick={func}
              className="border-t-2 border-t-gray-100 p-3 text-red-500"
            >
              {btn}
            </button>
            <button
              id="close"
              onClick={closeSide}
              className="border-t-2 border-t-gray-100 p-3"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  const manageForm = (e) => {
    if (e.target.name == "profile") {
      const [file] = e.target.files;
      e.target.nextElementSibling.setAttribute(
        "src",
        URL.createObjectURL(file)
      );
      setFormData({ ...formData, [e.target.name]: file });
      // then send to server
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    if (e.target.name == "password2" && formData.password1 != e.target.value) {
      setMessages({ ...messages, ["password"]: "passwords don't match." });
    } else {
      setMessages({ ...messages, ["password"]: null });
    }
  };

  const killAll = () => {
    // send to server
  };
  const signOut = () => {
    // send to server
  };
  const deleteAccount = () => {
    // send to server
  };
  const closeSide = (e) => {
    if (e.target.id == "close") {
      setShowSide(null);
      setMessages({});
      setIsLoading(false);
      setEditField(null);
    }
  };

  const chagnePassword = (e) => {
    e.preventDefault();
    setIsLoading(true);
  };

  const save = (e) => {
    setIsLoading(true);
    // sent to server
    // const text = e.target.parentElement.parentElement.offsetParent.children[0].children[1].value;
  };

  return (
    <main>
      <main className="mt-16 mb-16 sm:m-0 sm:ml-16 flex items-center justify-center">
        {isReady ? (
          <section className="p-6 max-w-6xl w-full">
            <h1 className="text-3xl border-b-2 border-gray-300 mb-4 py-2">
              About you
            </h1>
            <div className="flex justify-between mb-6">
              <div className="w-3/4">
                <h2 className="py-1 text-xl">Photo</h2>
                <p className="py-1 text-gray-700">
                  Your photo apears on your Profile page and with your posts
                  across Backslash.
                </p>
                <p className="py-1 text-gray-700">
                  Reccomened size: Square, at least 1000 pixels per side. File
                  type: JPG, PNG or GIF
                </p>
              </div>
              <div className="relative group flex items-center justify-center">
                <input
                  name="profile"
                  type="file"
                  name="profile"
                  onChange={manageForm}
                  className="w-full h-full  z-[1] absolute cursor-pointer opacity-0"
                  title="Click to change profile image"
                />
                <img
                  src={data.me.profile}
                  alt={`${data.me.name}'s image`}
                  className="w-[6rem] sm:w-[7rem] aspect-square rounded-full group-hover:brightness-75"
                />
                <div className="absolute w-5 h-5 rounded-full flex items-center justify-center bg-[#0000001a] opacity-75 group-hover:opacity-100 group-hover:scale-105">
                  <i className="bi bi-pencil absolute text-white"></i>
                </div>
              </div>
            </div>

            <div className="flex justify-between mb-6 relative">
              <div className="w-3/4">
                <h2 className="py-1 text-xl">Username</h2>
                {editField == "username" ? (
                  <input
                    defaultValue={data.me.username}
                    type="text"
                    maxLength={30}
                    pattern="^(?!.*\.\.)(?!.*\.$)[^\W][a-z0-9_.]{2,29}$"
                    placeholder="Username"
                    onChange={manageForm}
                    className="py-1 border-b-2 border-gray-300 w-full focus:border-gray-500"
                    disabled={!(editField == "username")}
                  />
                ) : (
                  <span className="py-1 border-b-2 border-gray-300 w-full block">
                    {data.me.username}
                  </span>
                )}
                <span
                  className={`text-red-500 text-sm ${
                    messages.username ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {messages.username || "Invalid usernadata.me."}
                </span>
                <p className="text-gray-700">
                  other people can find you with this usernadata.me.
                </p>
              </div>
              <div className="absolute right-0">
                {editField == "username" ? (
                  <div>
                    <button
                      onClick={save}
                      className={`text-white bg-indigo-500 whitespace-pre py-1 px-5  border-r-0 border-2 border-indigo-500 rounded-br-none rounded-tr-none rounded-full active:scale-[0.98] active:opacity-90 transition-all ${
                        isLoading && !showSide ? "opacity-75 cursor-wait" : ""
                      }`}
                    >
                      {isLoading && !showSide ? "Saving..." : "Save"}
                    </button>
                    <button
                      id="close"
                      onClick={closeSide}
                      className="whitespace-pre py-1 px-3  border-2 border-gray-300 rounded-bl-none rounded-tl-none rounded-full active:scale-[0.98] active:opacity-90 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditField("username")}
                    className="whitespace-pre py-1 px-3  border-2 border-gray-300 rounded-full active:scale-[0.98] active:opacity-90 transition-all"
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>

            <div className="flex justify-between mb-6 relative">
              <div className="w-3/4">
                <h2 className="py-1 text-xl">Name</h2>
                {editField == "name" ? (
                  <input
                    defaultValue={data.me.name}
                    type="text"
                    maxLength={50}
                    placeholder="Your name"
                    onChange={manageForm}
                    dir="auto"
                    className="py-1 border-b-2 border-gray-300 w-full focus:border-gray-500"
                    disabled={!(editField == "name")}
                  />
                ) : (
                  <span className="py-1 border-b-2 border-gray-300 w-full block">
                    {data.me.name}
                  </span>
                )}
                <span
                  className={`text-red-500 text-sm ${
                    messages.name ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {messages.name || "Invalid nadata.me."}
                </span>

                <p className=" text-gray-700">
                  Your name appeare on your Profile page, as your byline, and in
                  your responses.
                </p>
              </div>
              <div className="absolute right-0">
                {editField == "name" ? (
                  <div>
                    <button
                      onClick={save}
                      className={`text-white bg-indigo-500 whitespace-pre py-1 px-5  border-r-0 border-2 border-indigo-500 rounded-br-none rounded-tr-none rounded-full active:scale-[0.98] active:opacity-90 transition-all ${
                        isLoading && !showSide ? "opacity-75 cursor-wait" : ""
                      }`}
                    >
                      {isLoading && !showSide ? "Saving..." : "Save"}
                    </button>
                    <button
                      id="close"
                      onClick={closeSide}
                      className="whitespace-pre py-1 px-3  border-2 border-gray-300 rounded-bl-none rounded-tl-none rounded-full active:scale-[0.98] active:opacity-90 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditField("name")}
                    className="whitespace-pre py-1 px-3  border-2 border-gray-300 rounded-full active:scale-[0.98] active:opacity-90 transition-all"
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>

            <div className="flex justify-between mb-6 relative">
              <div className="w-3/4">
                <h2 className="py-1 text-xl">Bio</h2>
                {editField == "bio" ? (
                  <input
                    dir="auto"
                    defaultValue={data.me.bio}
                    type="text"
                    maxLength={150}
                    placeholder="Add your bio"
                    onChange={manageForm}
                    className="py-1 border-b-2 border-gray-300 w-full focus:border-gray-500"
                    disabled={!(editField == "bio")}
                  />
                ) : (
                  <span className="py-1 border-b-2 border-gray-300 w-full block">
                    {data.me.bio}
                  </span>
                )}
                <span
                  className={`text-red-500 text-sm ${
                    messages.bio ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {messages.bio || "Invalid bio."}
                </span>

                <p className="text-gray-700">
                  Your bio appears on your Profile and next to your posts.
                </p>
              </div>
              <div className="absolute right-0">
                {editField == "bio" ? (
                  <div>
                    <button
                      onClick={save}
                      className={`text-white bg-indigo-500 whitespace-pre py-1 px-5  border-r-0 border-2 border-indigo-500 rounded-br-none rounded-tr-none rounded-full active:scale-[0.98] active:opacity-90 transition-all ${
                        isLoading && !showSide ? "opacity-75 cursor-wait" : ""
                      }`}
                    >
                      {isLoading && !showSide ? "Saving..." : "Save"}
                    </button>
                    <button
                      id="close"
                      onClick={closeSide}
                      className="whitespace-pre py-1 px-3  border-2 border-gray-300 rounded-bl-none rounded-tl-none rounded-full active:scale-[0.98] active:opacity-90 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditField("bio")}
                    className="whitespace-pre py-1 px-3  border-2 border-gray-300 rounded-full active:scale-[0.98] active:opacity-90 transition-all"
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>

            <div className="flex justify-between mb-6 relative">
              <div className="w-3/4">
                <h2 className="py-1 text-xl">Email</h2>
                {editField == "email" ? (
                  <input
                    defaultValue={data.me.email}
                    type="email"
                    placeholder="email address"
                    onChange={manageForm}
                    className="py-1 border-b-2 border-gray-300 w-full focus:border-gray-500"
                    disabled={!(editField == "email")}
                  />
                ) : (
                  <span className="py-1 border-b-2 border-gray-300 w-full block">
                    {data.me.email}
                  </span>
                )}
                <span
                  className={`text-red-500 text-sm ${
                    messages.email ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {messages.email || "Invalid email."}
                </span>

                <p className="text-gray-700">
                  Your email address. this is your account identifire.
                </p>
              </div>
              <div className="absolute right-0">
                {editField == "email" ? (
                  <div>
                    <button
                      onClick={save}
                      className={`text-white bg-indigo-500 whitespace-pre py-1 px-5  border-r-0 border-2 border-indigo-500 rounded-br-none rounded-tr-none rounded-full active:scale-[0.98] active:opacity-90 transition-all ${
                        isLoading && !showSide ? "opacity-75 cursor-wait" : ""
                      }`}
                    >
                      {isLoading && !showSide ? "Saving..." : "Save"}
                    </button>
                    <button
                      id="close"
                      onClick={closeSide}
                      className="whitespace-pre py-1 px-3  border-2 border-gray-300 rounded-bl-none rounded-tl-none rounded-full active:scale-[0.98] active:opacity-90 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditField("email")}
                    className="whitespace-pre py-1 px-3  border-2 border-gray-300 rounded-full active:scale-[0.98] active:opacity-90 transition-all"
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>

            <h1 className="text-3xl border-b-2 border-gray-300 mb-4 mt-6 py-2">
              Account
            </h1>

            <div className="flex justify-between mb-4">
              <div>
                <h2 className="py-1 text-xl">Change password</h2>
                <p className="py-1 text-gray-700">
                  change your accounts password with given the old password
                </p>
              </div>
              <div>
                <button
                  onClick={() => {
                    setShowSide("changePassword");
                    isLoading(false);
                  }}
                  className="whitespace-pre py-1 px-3  border-2 border-gray-300 rounded-full active:scale-[0.98] active:opacity-90 transition-all"
                >
                  Change
                </button>
              </div>
              <div
                id="close"
                onClick={closeSide}
                className={`bg-[#00000078] backdrop-blur-sm fixed w-screen h-screen right-0 top-0 flex flex-col-reverse sm:flex-row-reverse z-[90] ${
                  showSide == "changePassword"
                    ? ""
                    : "opacity-0 pointer-events-none"
                }`}
              >
                <div
                  className={`${
                    showSide == "changePassword"
                      ? "translate-0"
                      : "translate-y-[100%] sm:translate-x-[100%] sm:translate-y-0"
                  } overflow-auto transition-all border-2 border-gray-100 flex flex-col z-20 bg-white absolute rounded-tr-3xl rounded-tl-3xl w-full h-4/5 sm:rounded-tr-none sm:rounded-bl-3xl sm:h-full sm:w-[28rem]`}
                >
                  <button
                    id="close"
                    className="p-2 w-full flex items-center justify-center sm:w-auto sm:h-full sm:left-0 sm:absolute"
                  >
                    <div className="rounded-full bg-gray-200 w-20 h-1 sm:h-20 sm:w-1"></div>
                  </button>
                  <form
                    onSubmit={chagnePassword}
                    method="POST"
                    className="flex flex-col items-center justify-center p-8"
                  >
                    <h1 className="text-2xl w-full mb-2">
                      Change Your Password
                    </h1>
                    <div className="w-full my-1 text-lg flex flex-col">
                      <input
                        className="border-gray-300 border-b-2 py-1 placeholder:text-gray-600 w-full focus:border-gray-500 focus:placeholder:text-gray-700"
                        type="password"
                        name="currentPassword"
                        placeholder="Current password"
                        onChange={manageForm}
                        required={true}
                      />
                      <span
                        className={`text-sm text-red-500 pt-1 ${
                          messages.currentPassword ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        {messages.currentPassword || "."}
                      </span>
                    </div>
                    <div className="w-full my-1 text-lg flex flex-col">
                      <input
                        className="border-gray-300 border-b-2 py-1 placeholder:text-gray-600 w-full focus:border-gray-500 focus:placeholder:text-gray-700"
                        type="password"
                        name="password1"
                        placeholder="New password"
                        onChange={manageForm}
                        pattern=".{8,}"
                        required={true}
                      />
                      <span className="text-sm text-red-500 pt-1 opacity-0">
                        Password is too short.
                      </span>
                    </div>
                    <div className="w-full my-1 text-lg flex flex-col">
                      <input
                        className="border-gray-300 border-b-2 py-1 placeholder:text-gray-600 w-full focus:border-gray-500 focus:placeholder:text-gray-700"
                        type="password"
                        name="password2"
                        placeholder="Retype new password"
                        onChange={manageForm}
                        required={true}
                      />
                      <span
                        className={`text-sm text-red-500 pt-1 ${
                          messages.password ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        {messages.password || "."}
                      </span>
                    </div>
                    <button
                      type="submit"
                      disabled={
                        !(
                          formData.currentPassword &&
                          formData.password1 == formData.password2
                        )
                      }
                      className={`px-4 py-3 w-full mt-1 rounded-full active:scale-[0.98] transition-all flex items-center justify-center bg-gray-900 text-white font-semibold text-lg disabled:opacity-50 disabled:pointer-events-none ${
                        isLoading ? "opacity-50 cursor-wait" : ""
                      }`}
                    >
                      {isLoading ? "Changing..." : "Change"}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <div className="flex justify-between mb-4">
              <div>
                <h2 className="py-1 text-xl">Sign out of all other sessions</h2>
                <p className="py-1 text-gray-700">
                  This will sign you out of sessions on other browsers or on
                  other computers
                </p>
              </div>
              <div>
                <button
                  onClick={() => setShowSide("killother")}
                  className="whitespace-pre py-1 px-3  border-2 border-gray-300 rounded-full active:scale-[0.98] active:opacity-90 transition-all"
                >
                  Kill other
                </button>
              </div>
              {showSide == "killother" ? (
                <Container
                  sideName="killother"
                  title="Kill all another sessions?"
                  about="if you press kill, all another sessions in another computers and browsers will be sign out."
                  btn="Kill"
                  func={killAll}
                />
              ) : (
                ""
              )}
            </div>

            <div className="flex justify-between mb-4">
              <div>
                <h2 className="py-1 text-xl">Sign out </h2>
                <p className="py-1 text-gray-700">
                  This will sign you out of session on this browser.
                </p>
              </div>
              <div>
                <button
                  onClick={() => setShowSide("signout")}
                  className="whitespace-pre py-1 px-3  border-2 border-gray-300 rounded-full active:scale-[0.98] active:opacity-90 transition-all"
                >
                  Sign out
                </button>
              </div>
              {showSide == "signout" ? (
                <Container
                  sideName="signout"
                  title="Sing out from this account?"
                  about="This will sign you out of session on this browser."
                  btn="Sign out"
                  func={signOut}
                />
              ) : (
                ""
              )}
            </div>

            <div className="flex justify-between mb-4">
              <div>
                <h2 className="py-1 text-xl">Delete account</h2>
                <p className="py-1 text-gray-700">
                  Permanently delete your account and all of your content
                </p>
              </div>
              <div>
                <button
                  onClick={() => setShowSide("delete")}
                  className="whitespace-pre py-1 px-3  border-2 border-gray-300 rounded-full active:scale-[0.98] active:opacity-90 transition-all"
                >
                  Delete
                </button>
              </div>
              {showSide == "delete" ? (
                <Container
                  sideName="delete"
                  title="Delete your account?"
                  about="Permanently delete your account and all of your contents"
                  btn="Delelte"
                  func={deleteAccount}
                />
              ) : (
                ""
              )}
            </div>
          </section>
        ) : (
          <section className="p-6 max-w-6xl w-full">
            <div className="border-b-2 border-gray-300 mb-4 py-2">
              <div className="h-6 w-1/2 bg-gray-200 overflow-hidden relative fadeInLoad rounded-full" />
            </div>
            <div className="flex justify-between mb-6">
              <div className="w-3/4 fadeInLoad overflow-hidden relative">
                <div className="h-5 my-1 w-1/4 bg-gray-200 rounded-full" />
                <div className="h-3 mt-2 my-1 w-full bg-gray-200 rounded-full " />
                <div className="h-3 my-1 w-3/4 bg-gray-200 rounded-full " />
                <div className="h-3 mt-3 my-1 w-full bg-gray-200 rounded-full " />
                <div className="h-3 my-1 w-3/4 bg-gray-200 rounded-full " />
              </div>
              <div className="  flex items-center justify-center">
                <div className="w-[6rem] sm:w-[7rem] aspect-square rounded-full relative fadeInLoad overflow-hidden bg-gray-200" />
              </div>
            </div>

            <div className="flex justify-between mb-4 overflow-hidden relative fadeInLoad">
              <div className="w-full">
                <div className="h-5 my-1 w-1/4 bg-gray-200 rounded-full" />
                <div className="h-3 mt-3 w-1/2 bg-gray-200 rounded-full " />
                <div className="h-3 mt-2 w-3/4 bg-gray-200 rounded-full " />
              </div>
              <div>
                <div className="py-1 px-3 rounded-full bg-gray-200 relative fadeInLoad overflow-hidden  w-12 h-8" />
              </div>
            </div>
            <div className="flex justify-between mb-4 overflow-hidden relative fadeInLoad">
              <div className="w-full">
                <div className="h-5 my-1 w-1/4 bg-gray-200 rounded-full" />
                <div className="h-3 mt-3 w-1/2 bg-gray-200 rounded-full " />
                <div className="h-3 mt-2 w-3/4 bg-gray-200 rounded-full " />
              </div>
              <div>
                <div className="py-1 px-3 rounded-full bg-gray-200 relative fadeInLoad overflow-hidden  w-12 h-8" />
              </div>
            </div>
            <div className="flex justify-between mb-4 overflow-hidden relative fadeInLoad">
              <div className="w-full">
                <div className="h-5 my-1 w-1/4 bg-gray-200 rounded-full" />
                <div className="h-3 mt-3 w-1/2 bg-gray-200 rounded-full " />
                <div className="h-3 mt-2 w-3/4 bg-gray-200 rounded-full " />
              </div>
              <div>
                <div className="py-1 px-3 rounded-full bg-gray-200 relative fadeInLoad overflow-hidden  w-12 h-8" />
              </div>
            </div>
            <div className="flex justify-between mb-4 overflow-hidden relative fadeInLoad">
              <div className="w-full">
                <div className="h-5 my-1 w-1/4 bg-gray-200 rounded-full" />
                <div className="h-3 mt-3 w-1/2 bg-gray-200 rounded-full" />
                <div className="h-3 mt-2 w-3/4 bg-gray-200 rounded-full" />
              </div>
              <div>
                <div className="py-1 px-3 rounded-full bg-gray-200 relative fadeInLoad overflow-hidden  w-12 h-8" />
              </div>
            </div>

            <div className="border-b-2 border-gray-300 mb-4 py-2">
              <div className="h-6 w-1/2 bg-gray-200 overflow-hidden relative fadeInLoad rounded-full" />
            </div>

            <div className="flex justify-between mb-4 overflow-hidden relative fadeInLoad">
              <div className="w-full">
                <div className="h-5 my-1 w-1/4 rounded-full bg-gray-200" />
                <div className="h-3 mt-2 w-3/4 bg-gray-200 rounded-full " />
              </div>
              <div>
                <div className="py-1 px-3 rounded-full bg-gray-200 relative fadeInLoad overflow-hidden  w-16 h-8" />
              </div>
            </div>
            <div className="flex justify-between mb-4 overflow-hidden relative fadeInLoad">
              <div className="w-full">
                <div className="h-5 my-1 w-1/4 rounded-full bg-gray-200" />
                <div className="h-3 mt-2 w-3/4 bg-gray-200 rounded-full " />
              </div>
              <div>
                <div className="py-1 px-3 rounded-full bg-gray-200 relative fadeInLoad overflow-hidden  w-16 h-8" />
              </div>
            </div>
            <div className="flex justify-between mb-4 overflow-hidden relative fadeInLoad">
              <div className="w-full">
                <div className="h-5 my-1 w-1/4 rounded-full bg-gray-200" />
                <div className="h-3 mt-2 w-3/4 bg-gray-200 rounded-full " />
              </div>
              <div>
                <div className="py-1 px-3 rounded-full bg-gray-200 relative fadeInLoad overflow-hidden  w-16 h-8" />
              </div>
            </div>
            <div className="flex justify-between mb-4 overflow-hidden relative fadeInLoad">
              <div className="w-full">
                <div className="h-5 my-1 w-1/4 rounded-full bg-gray-200" />
                <div className="h-3 mt-2 w-3/4 bg-gray-200 rounded-full " />
              </div>
              <div>
                <div className="py-1 px-3 rounded-full bg-gray-200 relative fadeInLoad overflow-hidden  w-16 h-8" />
              </div>
            </div>
          </section>
        )}
      </main>
    </main>
  );
};

const PostDetail = ({}) => {
  const [data, setData] = useContext(Context);
  const [post, setPost] = useState({});
  const [showComments, setShowComments] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const url = useParams();
  useEffect(() => {
    // emulate give from server
    setData({...data,["me"]: tempuser});
    setTimeout(() => {
      setPost(temppost);
      setIsReady(true);
    }, 1000);
  }, [1]);

  const Comment = ({ comment, loading }) => {
    let e;
    if (loading) {
      e = (
        <div className="sm:first:mt-2 px-2 py-2 border-b-2 border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center w-full fadeInLoad relative overflow-hidden ">
              <div className="h-12 w-12 rounded-full m-1 bg-gray-200 "></div>
              <div className="flex flex-col p-1 w-4/5 ">
                <div className="h-4 w-4/5 bg-gray-200 rounded-full"></div>

                <div className="h-3 w-1/5 bg-gray-200 rounded-full mt-1"></div>
              </div>
            </div>
          </div>
          <div className="mt-3 my-1 h-3 w-full rounded-full bg-gray-200 overflow-hidden fadeInLoad relative"></div>
          <div className="my-1 h-3 w-3/4 rounded-full bg-gray-200 overflow-hidden fadeInLoad relative"></div>
        </div>
      );
    } else {
      e = (
        <div className="sm:first:mt-2 px-2 py-2 border-b-2 border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center w-full overflow-hidden">
              <img
                src={comment.user.profile}
                alt={`${comment.user.name}'s image`}
                className="h-12 w-12 rounded-full p-1"
              />
              <div className="flex flex-col p-1 w-full">
                <Link
                  name={comment.user.name}
                  onClick={setTitle}
                  to={`/@${comment.user.username}`}
                  className="text-md w-[80%] truncate"
                >
                  {comment.user.name}
                </Link>
                <span className="text-gray-500 text-sm">
                  {timeSince(comment.date)}
                </span>
              </div>
            </div>

            <button className="p-2 flex items-center">
              <i className="bi bi-three-dots text-gray-500"></i>
            </button>
          </div>
          <p className="text-sm mt-1">{comment.text}</p>
        </div>
      );
    }
    return e;
  };

  const fallow = () => {
    data.setAlert(
      () => {
        // send to server
        setPost({
          ...post,
          ["user"]: { ...post.user, ["fallowed"]: !post.user.fallowed },
        });
      },
      data.me.id,
      "You are not logged in."
    );
  };

  const bookmark = () => {
    data.setAlert(
      () => {
        // send to server
        setPost({ ...post, ["bookmark"]: !post.bookmark });
      },
      data.me.id,
      "You are not logged in."
    );
  };

  const like = () => {
    data.setAlert(
      () => {
        // send to server
        setPost({ ...post, ["liked"]: !post.liked });
      },
      data.me.id,
      "You are not logged in."
    );
  };

  const closeSide = (e) => {
    if (e.target.id == "close") {
      setShowComments(false);
    }
  };

  const addComment = (e) => {
    // send to server
    const text = e.target.parentElement.children[1].value;
  };

  const Container = ({}) => {
    const [isReady, setIsReady] = useState(false);
    const [comments, setComments] = useState([]);

    useEffect(() => {
      // emulate give from server
      setTimeout(() => {
        setComments([tempcomment]);
        setIsReady(true);
      }, 1000);
    }, [1]);

    return (
      <div
        id="close"
        onClick={closeSide}
        className={`bg-[#00000078] backdrop-blur-sm fixed w-screen h-screen right-0 top-0 flex flex-col-reverse sm:flex-row-reverse z-[90] ${
          showComments ? "" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`${
            showComments
              ? "translate-0"
              : "translate-y-[100%] sm:translate-x-[100%] sm:translate-y-0"
          } transition-all border-2 border-gray-100 flex flex-col z-20 bg-white absolute rounded-tr-3xl rounded-tl-3xl w-full h-4/5 sm:rounded-tr-none sm:rounded-bl-3xl sm:h-full sm:w-[28rem]`}
        >
          <button
            id="close"
            className="p-2 w-full flex items-center justify-center sm:w-auto sm:h-full sm:left-0 sm:absolute"
          >
            <div className="rounded-full bg-gray-200 w-20 h-1 sm:h-20 sm:w-1"></div>
          </button>
          <div className="overflow-auto h-full sm:ml-4 px-2 pb-2">
            {isReady
              ? comments.map((i) => <Comment comment={i} id={i.id} />)
              : [1, 2, 3, 4, 5, 6, 6].map((i) => (
                  <Comment loading={true} id={i} />
                ))}
          </div>
          {data.me.id ? (
            <div className="w-full p-2 flex border-t-2 border-gray-100">
              <img
                src={data.me.profile}
                alt={`${data.me.name}'s image`}
                className="rounded-full h-9 w-9 p-1"
              />
              <input
                type="text"
                placeholder="Add a comment"
                className="p-1 w-full"
              />
              <button
                onClick={addComment}
                className="p-1 text-indigo-500 hover:text-indigo-700 "
              >
                Post
              </button>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  };

  return (
    <main>
      <main className="mt-16 mb-16 sm:m-0 sm:ml-16 flex items-center justify-center">
        {isReady ? (
          <section className="p-6 max-w-6xl w-full">
            <div className="head flex items-center justify-between">
              <div className="flex items-center ">
                <img
                  src={post.user.profile}
                  alt={`${post.user.name}'s image`}
                  className="w-12 h-12 rounded-full "
                />

                <div className="flex flex-col ml-3 ">
                  <Link
                    name={post.user.name}
                    onClick={setTitle}
                    to={`/@${post.user.username}`}
                    className="text-md sm:text-xl font-semibold  max-w-[13ch] sm:max-w-[25ch] lg:max-w-[50ch]"
                  >
                    {post.user.name}
                  </Link>
                  <div>
                    <span className="text-gray-500 whitespace-pre">
                      {timeSince(post.date)}
                    </span>
                    <span className="text-gray-500 mx-1 hidden sm:inline">•</span>
                    <span className="text-gray-500 whitespace-pre hidden sm:inline">
                      {Math.ceil(post.text.split(" ").length / 200)} min{" "}
                      <span className="hidden md:inline">read</span>
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={fallow}
                className={`py-1 px-3 rounded-full active:scale-[0.98] transition-all border-2 border-indigo-500 ${
                  post.user.fallowed
                    ? "text-indigo-500  bg-white"
                    : "text-white bg-indigo-500"
                } `}
              >
                {post.user.fallowed ? "Unfallow" : "Fallow"}
              </button>
            </div>

            <div className="tags flex mt-3 items-center justify-between">
              <div className="relative flex items-center whitespace-pre w-[calc(100%-1rem)] overflow-hidden  after:bg-gradient-to-l after:from-white after:to-transparent after:right-0 after:absolute after:h-full after:w-6">
                {post.tags.map((i) => (
                  <Tag tag={i} id={i.id} />
                ))}
              </div>
              <button onClick={bookmark} className="flex">
                <i
                  className={`bi bi-bookmark-${
                    post.bookmark ? "fill" : "plus"
                  } p-1 cursor-pointer mx-1 `}
                ></i>
              </button>
            </div>

            <article
              dir="auto"
              className="mt-2"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(marked.parse(post.text)),
              }}
            />

            <div className="flex mt-6 items-center justify-between text-lg">
              <div className="flex ">
                <button className="mr-2" onClick={like}>
                  <i
                    className={`bi bi-heart${
                      post.liked ? "-fill" : ""
                    } pl-0 p-1 text-gray-700`}
                  ></i>
                  <span className="py-1 text-gray-500 text-md">
                    {nFormatter(post.likes)}
                  </span>
                </button>
                <button className="mr-2" onClick={() => setShowComments(true)}>
                  <i className="bi-chat p-1 text-gray-700"></i>
                  <span className="py-1 text-gray-500 text-md">
                    {nFormatter(post.comments)}
                  </span>
                </button>
                {showComments ? <Container /> : ""}
              </div>
              <div className="flex">
                <i
                  onClick={bookmark}
                  className={`bi bi-bookmark-${
                    post.bookmark ? "fill" : "plus"
                  } p-1 cursor-pointer mx-1  text-gray-700`}
                ></i>
                <i className="bi bi-three-dots pr-0 p-1 cursor-pointer mx-1 text-gray-700"></i>
              </div>
            </div>

            <div className="reccomeneds mt-14">
              <h1 className="text-3xl border-b-2 border-gray-300 mb-4 py-2">
                More From
                <Link
                  name={post.user.name}
                  onClick={setTitle}
                  to={`/@${post.user.username}`}
                  className="text-indigo-500 mx-1"
                >
                  {post.user.name}
                </Link>
              </h1>
              <div>
                {post.user.posts.map((p) => (
                  <Post post={p} id={p.id} />
                ))}
              </div>
            </div>
          </section>
        ) : (
          <section className="p-6 max-w-6xl w-full">
            <div className="head flex items-center justify-between">
              <div className="flex items-center overflow-hidden fadeInLoad relative">
                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden relative" />

                <div className="flex flex-col ml-3">
                  <div className="max-w-[19ch] sm:max-w-[25ch] lg:max-w-[50ch] h-4 bg-gray-200 rounded-full " />
                  <div className="flex mt-1 items-center">
                    <div className="bg-gray-200 h-3 rounded-full w-16" />
                    <span className="text-gray-200 mx-1">•</span>
                    <div className="bg-gray-200 h-3 rounded-full w-16" />
                  </div>
                </div>
              </div>

              <div
                className={`py-1 px-3 rounded-full bg-gray-200 relative fadeInLoad overflow-hidden  w-20 h-8`}
              />
            </div>

            <div className="tags flex mt-3 items-center justify-between">
              <div className="relative flex items-center whitespace-pre w-[calc(100%-1rem)] overflow-hidden  after:bg-gradient-to-l after:from-white after:to-transparent after:right-0 after:absolute after:h-full after:w-6">
                {[1, 2, 3, 4].map((i) => (
                  <Tag loading={true} id={i} />
                ))}
              </div>
            </div>

            <article className="mt-2">
              <div className="my-4 mb-2 w-1/2 h-5 rounded-full bg-gray-200 fadeInLoad relative overflow-hidden" />
              <div className="w-full h-3 my-1 rounded-full bg-gray-200 fadeInLoad relative overflow-hidden" />
              <div className="w-full h-3 my-1 rounded-full bg-gray-200 fadeInLoad relative overflow-hidden" />
              <div className="w-3/4 h-3 my-1 rounded-full bg-gray-200 fadeInLoad relative overflow-hidden" />

              <div className="my-4 mb-2 w-1/2 h-5 rounded-full bg-gray-200 fadeInLoad relative overflow-hidden" />
              <div className="w-full h-3 my-1 rounded-full bg-gray-200 fadeInLoad relative overflow-hidden" />
              <div className="w-full h-3 my-1 rounded-full bg-gray-200 fadeInLoad relative overflow-hidden" />
              <div className="w-full h-3 my-1 rounded-full bg-gray-200 fadeInLoad relative overflow-hidden" />
              <div className="w-full h-3 my-1 rounded-full bg-gray-200 fadeInLoad relative overflow-hidden" />
              <div className="mb-3 w-3/4 h-3 my-1 rounded-full bg-gray-200 fadeInLoad relative overflow-hidden" />

              <div className="my-3 rounded-xl bg-gray-200 relative overflow-hidden fadeInLoad w-full h-64" />

              <div className="mt-2 w-full h-3 my-1 rounded-full bg-gray-200 fadeInLoad relative overflow-hidden" />
              <div className="w-full h-3 my-1 rounded-full bg-gray-200 fadeInLoad relative overflow-hidden" />
              <div className="mb-3 w-3/4 h-3 my-1 rounded-full bg-gray-200 fadeInLoad relative overflow-hidden" />

              <div className="my-4 mb-2 w-1/2 h-5 rounded-full bg-gray-200 fadeInLoad relative overflow-hidden" />
              <div className="w-full h-3 my-1 rounded-full bg-gray-200 fadeInLoad relative overflow-hidden" />
              <div className="w-full h-3 my-1 rounded-full bg-gray-200 fadeInLoad relative overflow-hidden" />
              <div className="w-full h-3 my-1 rounded-full bg-gray-200 fadeInLoad relative overflow-hidden" />
              <div className="w-full h-3 my-1 rounded-full bg-gray-200 fadeInLoad relative overflow-hidden" />
              <div className="w-full h-3 my-1 rounded-full bg-gray-200 fadeInLoad relative overflow-hidden" />
              <div className="w-full h-3 my-1 rounded-full bg-gray-200 fadeInLoad relative overflow-hidden" />
              <div className="mb-3 w-3/4 h-3 my-1 rounded-full bg-gray-200 fadeInLoad relative overflow-hidden" />

              <div className="my-3 rounded-xl bg-gray-200 relative overflow-hidden fadeInLoad w-full h-64" />

              <div className="mt-2 w-full h-3 my-1 rounded-full bg-gray-200 fadeInLoad relative overflow-hidden" />
              <div className="w-full h-3 my-1 rounded-full bg-gray-200 fadeInLoad relative overflow-hidden" />
              <div className="w-full h-3 my-1 rounded-full bg-gray-200 fadeInLoad relative overflow-hidden" />
              <div className="w-full h-3 my-1 rounded-full bg-gray-200 fadeInLoad relative overflow-hidden" />
              <div className="mb-3 w-3/4 h-3 my-1 rounded-full bg-gray-200 fadeInLoad relative overflow-hidden" />

              <div className="my-4 mb-2 w-1/2 h-5 rounded-full bg-gray-200 fadeInLoad relative overflow-hidden" />
              <div className="w-full h-3 my-1 rounded-full bg-gray-200 fadeInLoad relative overflow-hidden" />
              <div className="w-full h-3 my-1 rounded-full bg-gray-200 fadeInLoad relative overflow-hidden" />
              <div className="mb-3 w-3/4 h-3 my-1 rounded-full bg-gray-200 fadeInLoad relative overflow-hidden" />
            </article>

            <div className="reccomeneds mt-14">
              <div className="border-b-2 border-gray-300 mb-4 py-2">
                <div className="h-6 w-3/4 bg-gray-200 overflow-hidden relative fadeInLoad rounded-full" />
              </div>
              <div>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Post loading={true} id={i} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </main>
  );
};

