const Link = ReactRouterDOM.Link;
const Route = ReactRouterDOM.Route;
const Router = ReactRouterDOM.BrowserRouter;
const Switch = ReactRouterDOM.Switch;
const useParams = ReactRouterDOM.useParams;
const useContext = React.useContext;
const useState = React.useState;
const useEffect = React.useEffect;
const createContext = React.createContext;

const getMyInfo = (ctext) => {
  const [data, setData] = ctext;
  $.ajax({
    method: "POST",
    url: "/api/me",
    data: { csrfmiddlewaretoken: data.csrfmiddlewaretoken },
    success: (r) => {
      data.setIsReady(true);
      if (r.result) {
        setData({ ...data, ["me"]: r.me });
      }
    },
    error: () => {
      showMsg("An unknown network error has occurred");
      setTimeout(getMyInfo, 10000);
    },
  });
};

const cleanMd = (text) => {
  return text.replace(/[#```>\*]+|<\w.*?>/g, "").replace(/\n+/g, " ");
};

const showMsg = (message, t = 5000) => {
  const container = $("#msgContainer");
  const msg = $("#msgContainer #msg");
  msg.text(message);
  container.removeClass("opacity-0 pointer-events-none");

  setTimeout(() => {
    container.addClass("opacity-0 pointer-events-none");
    msg.text("");
  }, t);
};

// some general function
const setTitle = (e) => {
  $("main").scrollTop(0);
  document.title = "BACKSLASH - " + e.currentTarget.name;
};

const timeSince = (date) => {
  var seconds = Math.floor((new Date() - new Date(date).getTime()) / 1000);

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

  return `${randColor || "gray"}-${randTuns || 900}`;
};

const Loading = () => {
  return <p className="mt-8 text-center text-indigo-600 loading">Loading...</p>;
};

const Auth = ({ page }) => {
  const [data, setData] = useContext(Context);

  const about = {
    login: {
      url: "/accounts/login",
      help: "create new account",
      helpurl: "/accounts/join",
      about: "",
      apiurl: "/api/accounts/login",
    },
    join: {
      url: "/accounts/join",
      help: "already have account",
      helpurl: "/accounts/login",
      about: "",
      apiurl: "/api/accounts/join",
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
    if (status == "join") {
      setStatus("login");
    } else if (status == "login") {
      setStatus("join");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessages({});
    if (status === "join") {
      setIsLoading(true);
      $.ajax({
        method: "POST",
        url: about["join"]["apiurl"],
        data: formData,
        success: (r) => {
          setIsLoading(false);
          if (r.result) {
            document.location = "/";
          }
          setMessages(r);
        },
      });
    } else if (status === "login") {
      setIsLoading(true);
      $.ajax({
        method: "POST",
        url: about["login"]["apiurl"],
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
          {status[0].toUpperCase() + status.slice(1)}
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
            pattern={status === "join" ? ".{8,}" : ".*"}
            onChange={manageData}
            required={true}
          />
          <span
            className={`text-sm ${
              status == "join" ? "text-red-500" : "text-white"
            } pt-1 ${messages.password2 ? "opacity-100" : "opacity-0"}`}
          >
            {messages.password2 ||
              (status == "join" ? "This password is too short." : "|")}
          </span>
        </div>

        {status == "join" ? (
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
          {status[0].toUpperCase() + status.slice(1) + (isLoading ? "..." : "")}
        </button>
        <Link
          name={status}
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
      } w-full h-16 border-t-2 bottom-0 border-gray-200 sm:left-0 sm:h-full sm:w-16 sm:border-r-2 sm:flex-col sm:justify-between z-10`}
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
            className={`px-4 m-2 text-2xl flex items-center justify-center cursor-pointer sm:after:absolute sm:after:left-[100%] sm:after:py-1 sm:after:px-2 sm:after:bg-gray-900 sm:after:rounded-lg sm:after:text-base sm:after:flex sm:after:items-center sm:after:justify-center sm:after:border-[1px] sm:after:border-gray-700 sm:after:text-white sm:after:opacity-0 sm:after:-translate-y-3 hover:sm:after:translate-y-0 hover:sm:after:opacity-100 hover:sm:after:transition-all sm:after:transition-none after:pointer-events-none sm:after:content-[attr(tooltip)] focus-visible:scale-110  focus-visible:text-gray-900 ${
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
            className={`px-4 m-2 text-2xl flex items-center justify-center cursor-pointer sm:after:absolute sm:after:left-[100%] sm:after:py-1 sm:after:px-2 sm:after:bg-gray-900 sm:after:rounded-lg sm:after:text-base sm:after:flex sm:after:items-center sm:after:justify-center sm:after:border-[1px] sm:after:border-gray-700 sm:after:text-white sm:after:opacity-0 sm:after:-translate-y-3 hover:sm:after:translate-y-0 hover:sm:after:opacity-100 hover:sm:after:transition-all sm:after:transition-none after:pointer-events-none sm:after:content-[attr(tooltip)] focus-visible:scale-110  focus-visible:text-gray-900 ${
              state == "Search" ? "text-gray-900" : "text-gray-500"
            }`}
          >
            <i className="bi bi-search"></i>
          </Link>

          <Link
            name={data.me.id ? "Bookmarks" : ""}
            onClick={(e) =>
              data.me.id ? setTitle(e) : showMsg("Please login")
            }
            to={data.me.id ? "/bookmarks" : ""}
            tooltip="Bookmarks"
            className={`px-4 m-2 text-2xl flex  items-center justify-center cursor-pointe sm:after:absolute sm:after:left-[100%] sm:after:py-1 sm:after:px-2 sm:after:bg-gray-900 sm:after:rounded-lg sm:after:text-base sm:after:flex sm:after:items-center sm:after:justify-center sm:after:border-[1px] sm:after:border-gray-700 sm:after:text-white sm:after:opacity-0 sm:after:-translate-y-3 hover:sm:after:translate-y-0 hover:sm:after:opacity-100 hover:sm:after:transition-all sm:after:transition-none after:pointer-events-none sm:after:content-[attr(tooltip)] focus-visible:scale-110  focus-visible:text-gray-900 ${
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
            name={data.me.id ? "Write" : ""}
            onClick={(e) =>
              data.me.id ? setTitle(e) : showMsg("Please login")
            }
            to={data.me.id ? "/write" : ""}
            tooltip="Write"
            className={`px-4 m-2 text-2xl hidden sm:flex  items-center justify-center cursor-pointe sm:after:absolute sm:after:left-[100%] sm:after:py-1 sm:after:px-2 sm:after:bg-gray-900 sm:after:rounded-lg sm:after:text-base sm:after:flex sm:after:items-center sm:after:justify-center sm:after:border-[1px] sm:after:border-gray-700 sm:after:text-white sm:after:opacity-0 sm:after:-translate-y-3 hover:sm:after:translate-y-0 hover:sm:after:opacity-100 hover:sm:after:transition-all sm:after:transition-none after:pointer-events-none sm:after:content-[attr(tooltip)] focus-visible:scale-110  focus-visible:text-gray-900 ${
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
              className={`px-4 m-2 text-2xl hidden sm:flex  items-center justify-center cursor-pointe sm:after:absolute sm:after:left-[100%] sm:after:py-1 sm:after:px-2 sm:after:bg-gray-900 sm:after:rounded-lg sm:after:text-base sm:after:flex sm:after:items-center sm:after:justify-center sm:after:border-[1px] sm:after:border-gray-700 sm:after:text-white sm:after:opacity-0 sm:after:-translate-y-3 hover:sm:after:translate-y-0 hover:sm:after:opacity-100 hover:sm:after:transition-all sm:after:transition-none after:pointer-events-none sm:after:content-[attr(tooltip)] focus-visible:scale-110  focus-visible:text-gray-900 ${
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
          className="flex items-center justify-center h-full sm:h-auto sm:w-full aspect-square sm:after:whitespace-pre sm:after:absolute sm:after:left-[100%] sm:after:py-1 sm:after:px-2 sm:after:bg-gray-900 sm:after:rounded-lg sm:after:text-base sm:after:flex sm:after:items-center sm:after:justify-center sm:after:border-[1px] sm:after:border-gray-700 sm:after:text-white sm:after:opacity-0 sm:after:-translate-y-3 hover:sm:after:translate-y-0 hover:sm:after:opacity-100 hover:sm:after:transition-all sm:after:transition-none after:pointer-events-none sm:after:content-[attr(tooltip)] focus-visible:scale-110  focus-visible:text-gray-900"
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
          to="/accounts/login"
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
          to="/accounts/login"
          className="block px-8 py-2 bg-gray-900 text-white rounded-full mx-4 cursor-pointer active:scale-[0.98] active:opacity-90 transition-all"
        >
          Join
        </Link>
      ) : state == "Write" ? (
        ""
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
        to={`/t/${tag.name}`}
        className={`hover:underline focus-visible:underline mr-2 text-${genColor(
          tag.id
        )}`}
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

const Post = ({ post = {}, loading, onTitle = () => {} }) => {
  const [isBookmark, setIsBookmark] = useState(post.bookmark);
  const [data, setData] = useContext(Context);

  const bookmark = () => {
    if (data.me.id) {
      $.ajax({
        method: "POST",
        url: `/api/@${post.user.username}/${post.slug}/bookmark`,
        data: { csrfmiddlewaretoken: data.csrfmiddlewaretoken, id: post.id },
        success: (r) => {
          if (r.result) {
            setIsBookmark(!isBookmark);
          } else {
            showMsg("An unknown error has occurred");
          }
        },
        error: () => {
          showMsg("An unknown network error has occurred");
        },
      });
    } else {
      showMsg("Please login");
    }
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
              className="w-8 h-8 rounded-full overflow-hidden"
            />
            <Link
              name={post.user.name}
              onClick={setTitle}
              to={
                data.me.id == post.user.id ? "/me" : `/@${post.user.username}`
              }
              className="font-semibold ml-3 max-w-[15ch] sm:max-w-[25ch] lg:max-w-[50ch] truncate hover:underline focus-visible:underline"
            >
              {post.user.name}
            </Link>
            <span className="text-gray-500 mx-1">•</span>
            <span className="text-gray-500 whitespace-pre">
              {timeSince(post.date)}
            </span>
            <span className="text-gray-500 mx-1 hidden sm:inline">•</span>
            <span className="text-gray-500 whitespace-pre hidden sm:inline">
              {Math.ceil(cleanMd(post.text).split(" ").length / 200)} min read
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
          <h1
            dir="auto"
            className="text-2xl font-bold truncate hover:underline"
          >
            <Link
              name={post.title}
              onClick={(e) => {
                setTitle(e);
                onTitle(post.user.username, post.slug);
              }}
              to={`/@${post.user.username}/${post.slug}`}
              className="hover:underline focus-visible:underline"
            >
              {post.title}
            </Link>
          </h1>
          <p className="mt-1" dir="auto">
            {cleanMd(post.text).slice(0, 150)}...
          </p>
        </div>
      )}

      {loading ? (
        <div className="tags flex mt-3 items-center justify-between">
          <div className="relative flex items-center whitespace-pre w-9/12 overflow-hidden  ">
            {[1, 2, 3, 4].map((i) => (
              <Tag loading={true} key={i} />
            ))}
          </div>
        </div>
      ) : (
        <div className="tags flex mt-3 items-center justify-between">
          <div className="relative flex items-center whitespace-pre w-9/12 overflow-hidden  after:bg-gradient-to-l after:from-white after:to-transparent after:right-0 after:absolute after:h-full after:w-6">
            {post.tags.map((tag) => (
              <Tag tag={tag} key={tag.id} />
            ))}
          </div>

          <div className="flex relative">
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  `${window.location.origin}/@${post.user.username}/${post.slug}`
                );
                showMsg("Link copied");
              }}
              className="focus-visible:scale-110"
            >
              <i className="bi bi-link-45deg p-1 cursor-pointer mx-1"></i>
            </button>
            <button onClick={bookmark} className="focus-visible:scale-110">
              <i
                className={`bi bi-bookmark-${
                  isBookmark ? "fill" : "plus"
                } p-1 cursor-pointer mx-1  `}
              ></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Home = ({}) => {
  const [fallowings, setFallowings] = useState({ items: [], hasNext: true });
  const [rec, setRec] = useState({ items: [], hasNext: true });
  const [latests, setLatests] = useState({ items: [], hasNext: true });
  const [fallowingUsers, setFallowingUsers] = useState({
    items: [],
    hasNext: true,
  });
  const [tags, setTags] = useState({ items: [], hasNext: true });

  const [state, setState] = useState("rec");
  const [data, setData] = useContext(Context);

  const getRec = () => {
    $.ajax({
      method: "POST",
      url: "/api/rec",
      data: {
        csrfmiddlewaretoken: data.csrfmiddlewaretoken,
        page: rec.items.length / 15 + 1,
      },
      success: (r) => {
        if (r.result) {
          r["items"] = rec.items.concat(r.items);
          r["isReady"] = true;
          setRec(r);
        } else {
          showMsg("An unexpected error occurred");
        }
      },
      error: () => {
        showMsg("An unknown network error has occurred");
        setTimeout(getRec, 10000);
      },
    });
  };
  const getLatests = () => {
    $.ajax({
      method: "POST",
      url: "/api/latests",
      data: {
        csrfmiddlewaretoken: data.csrfmiddlewaretoken,
        page: latests.items.length / 15 + 1,
      },
      success: (r) => {
        if (r.result) {
          r["items"] = latests.items.concat(r.items);
          r["isReady"] = true;
          setLatests(r);
        } else {
          showMsg("An unexpected error occurred");
        }
      },
      error: () => {
        showMsg("An unknown network error has occurred");
        setTimeout(getLatests, 10000);
      },
    });
  };
  const getFallowingUsers = () => {
    $.ajax({
      method: "POST",
      url: "/api/me/fallowings",
      data: {
        csrfmiddlewaretoken: data.csrfmiddlewaretoken,
        page: fallowingUsers.items.length / 15 + 1,
      },
      success: (r) => {
        if (r.result) {
          r["items"] = fallowingUsers.items.concat(r.items);
          r["isReady"] = true;
          setFallowingUsers(r);
        } else {
          showMsg("An unexpected error occurred");
        }
      },
      error: () => {
        showMsg("An unknown network error has occurred");
        setTimeout(getFallowingUsers, 10000);
      },
    });
  };
  const getTags = () => {
    $.ajax({
      method: "POST",
      url: "/api/me/tags",
      data: {
        csrfmiddlewaretoken: data.csrfmiddlewaretoken,
        page: tags.items.length / 15 + 1,
      },
      success: (r) => {
        if (r.result) {
          r["items"] = tags.items.concat(r.items);
          r["isReady"] = true;
          setTags(r);
        } else {
          showMsg("An unexpected error occurred");
        }
      },
      error: () => {
        showMsg("An unknown network error has occurred");
        setTimeout(getTags, 10000);
      },
    });
  };

  const getBase = () => {
    $.ajax({
      method: "GET",
      url: "/api/base/",
      data: {
        csrfmiddlewaretoken: data.csrfmiddlewaretoken,
      },
      success: (r) => {
        setRec({ ...r.rec, ["isReady"]: true });
        if (r.me) {
          setFallowingUsers({ ...r.fallowings, ["isReady"]: true });
          setTags({ ...r.tags, ["isReady"]: true });
          setData({ ...data, ["me"]: r.me || {} });
        }
        data.setIsReady(true);
      },
      error: () => {
        showMsg("An unknown network error has occurred");
        setTimeout(getBase, 10000);
      },
    });
  };

  useEffect(() => {
    getBase();
  }, [1]);

  useEffect(() => {
    const load = document.querySelector("#postsContainer .loading");

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (state == "rec") {
            getRec();
          } else if (state == "latests") {
            getLatests();
          }
        }
      });
    });
    if (load) {
      observer.observe(load);
    }
  }, [rec, latests]);

  useEffect(() => {
    const load = document.querySelector("#tagsContainer .loading");

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          getTags();
        }
      });
    });
    if (load) {
      observer.observe(load);
    }
  }, [tags]);

  useEffect(() => {
    const load = document.querySelector(
      "#fallowingUsersContainer .loading"
    );

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          getFallowingUsers();
        }
      });
    });
    if (load) {
      observer.observe(load);
    }
  }, [fallowingUsers]);

  return (
    <main>
      <main className="mt-16 mb-16 sm:m-0 sm:ml-16 flex items-center justify-center">
        <section className="p-6 max-w-6xl w-full">
          {data.me.id ? (
            <div
              id="tagsContainer"
              className="overflow-auto ml-3 flex items-center whitespace-pre"
            >
              {tags.isReady
                ? tags.items.map((i) => <Tag tag={i} key={i.id} />)
                : [1, 2, 3].map((i) => <Tag loading={true} key={i} />)}
              {tags.hasNext && tags.isReady ? (
                <span className="mx-4 text-xl loading">...</span>
              ) : (
                ""
              )}
            </div>
          ) : (
            ""
          )}
          {data.me.id ? (
            <div
              id="fallowingUsersContainer"
              className="py-2 my-4 flex overflow-auto"
            >
              {fallowingUsers.isReady
                ? fallowingUsers.items.map((i) => (
                    <Fallowing user={i} key={i.id} />
                  ))
                : [1, 2, 3].map((i) => <Fallowing loading={true} key={i} />)}
              {fallowingUsers.hasNext && fallowingUsers.isReady ? (
                <div className="h-12 w-12 text-xl loading px-4">
                  <span className="m-auto">...</span>
                </div>
              ) : (
                ""
              )}
            </div>
          ) : (
            ""
          )}
          {rec.isReady ? (
            <div className="border-b-2 text-sm sm:text-base flex justify-between sm:block">
              <button
                onClick={() => {
                  if (rec.items.length == 0) {
                    getRec();
                  }
                  setState("rec");
                }}
                className={`transition-all py-2 px-3 translate-y-[2px] border-b-2 w-full sm:w-auto focus-visible:scale-110  focus-visible:opacity-100 ${
                  state == "rec" ? "border-gray-900" : "opacity-[0.75]"
                }`}
              >
                Recommended
              </button>
              <button
                onClick={() => {
                  if (latests.items.length == 0) {
                    getLatests();
                  }
                  setState("latests");
                }}
                className={`transition-all py-2 px-3 translate-y-[2px] border-b-2 w-full sm:w-auto focus-visible:scale-110  focus-visible:opacity-100 ${
                  state == "latests" ? "border-gray-900" : "opacity-[0.75]"
                }`}
              >
                latests
              </button>
            </div>
          ) : (
            <div className="border-b-2 text-sm sm:text-base flex justify-between sm:block">
              <button className="py-2 px-3 translate-y-[2px] border-b-2 w-full sm:w-auto">
                <div className="fadeInLoad relative rounded-full h-5 w-20 bg-gray-200" />
              </button>
              <button className="py-2 px-3 translate-y-[2px] border-b-2 w-full sm:w-auto">
                <div className="fadeInLoad relative rounded-full h-5 w-20 bg-gray-200" />
              </button>
            </div>
          )}
          <div id="postsContainer">
            {state == "rec" &&
              rec.items.map((i) => <Post post={i} key={i.id} />)}
            {state == "latests" &&
              latests.items.map((i) => <Post post={i} key={i.id} />)}

            {((state == "rec" && rec.hasNext && rec.isReady) ||
              (state == "latests" && latests.hasNext && latests.isReady)) && (
              <Loading />
            )}
            {((state == "rec" && !rec.isReady) ||
              (state == "latests" && !latests.isReady)) &&
              [1, 2, 3, 4, 5].map((i) => <Post loading={true} key={i} />)}
          </div>
        </section>
      </main>
    </main>
  );
};

const TagView = ({}) => {
  const [tag, setTag] = useState({});
  const [posts, setPosts] = useState({ items: [], hasNext: true });
  const [data, setData] = useContext(Context);
  const [is404, setIs404] = useState(false);

  const url = useParams();

  const getTag = () => {
    $.ajax({
      method: "POST",
      url: `/api/t/${url.name}`,
      data: { csrfmiddlewaretoken: data.csrfmiddlewaretoken },
      success: (r) => {
        setTag({ ...r.tag, ["isReady"]: true });
        setPosts({ ...r.posts, ["isReady"]: true });

        setData({ ...data, ["me"]: r.me });
        data.setIsReady(true);
      },
      error: (xhr) => {
        if (xhr.status == 404) {
          setIs404(true);
        } else {
          showMsg("An unknown network error has occurred");
        }
      },
    });
  };
  const getPosts = () => {
    $.ajax({
      method: "POST",
      url: `/api/posts/${url.name}`,
      data: {
        csrfmiddlewaretoken: data.csrfmiddlewaretoken,
        page: posts.items.length / 15 + 1,
      },
      success: (r) => {
        if (r.result) {
          r["items"] = posts.items.concat(r.items);
          r["isReady"] = true;
          setPosts(r);
        } else {
          showMsg("An unknown error has occurred");
        }
      },
      error: () => {
        showMsg("An unknown network error has occurred");
        setTimeout(getPosts, 10000);
      },
    });
  };
  useEffect(() => {
    const load = document.querySelector("#postsContainer .loading");

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          getPosts();
        }
      });
    });
    if (load) {
      observer.observe(load);
    }
  }, [posts]);

  useEffect(() => {
    getTag();
  }, [1]);

  const fallow = () => {
    if (data.me.id) {
      $.ajax({
        method: "POST",
        url: `/api/fallow/${tag.name}`,
        data: { csrfmiddlewaretoken: data.csrfmiddlewaretoken, id: tag.id },
        success: (r) => {
          if (r.result) {
            setTag({ ...tag, ["fallowed"]: !tag.fallowed });
          } else {
            showMsg("An unknown error has occurred");
          }
        },
        error: () => {
          showMsg("An unknown network error has occurred");
        },
      });
    } else {
      showMsg("Please login");
    }
  };
  return (
    <main>
      <main className="mt-16 mb-16 sm:m-0 sm:ml-16 flex items-center justify-center">
        {is404 ? (
          <Page404 />
        ) : (
          <section className="p-6 max-w-6xl w-full">
            {tag.isReady ? (
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
                  className={`py-1 px-3 rounded-full active:scale-[0.98] transition-all focus-visible:scale-110 ${
                    tag.fallowed
                      ? "text-indigo-500 border-2 border-indigo-500 bg-white"
                      : "text-white bg-indigo-500"
                  } `}
                >
                  {tag.fallowed ? "Unfallow" : "Fallow"}
                </button>
              </div>
            ) : (
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
            )}

            {posts.isReady ? (
              <div className="mt-8 border-b-2 border-gray-400 flex ">
                <button className="py-2 px-3 border-b-2 border-gray-900 translate-y-[2px] ">
                  Home
                </button>
              </div>
            ) : (
              <div className="tm-4 border-b-2 flex ">
                <button className="py-2 px-3 translate-y-[2px] border-b-2">
                  <div className="fadeInLoad relative rounded-full h-5 w-20 bg-gray-200" />
                </button>
              </div>
            )}

            <div id="postsContainer">
              {posts.isReady
                ? posts.items.map((p) => <Post post={p} key={p.id} />)
                : [1, 2, 3, 4, 5].map((i) => <Post loading={true} key={i} />)}
              {posts.hasNext && posts.isReady ? <Loading /> : ""}
            </div>
          </section>
        )}
      </main>
    </main>
  );
};

const PeopleItem = ({ user = {}, inSearch, loading }) => {
  const [data, setData] = useContext(Context);
  const [fallowed, setFallowed] = useState(user.fallowed);

  const fallow = () => {
    if (data.me.id) {
      $.ajax({
        method: "POST",
        url: `/api/fallow/@${user.username}`,
        data: { csrfmiddlewaretoken: data.csrfmiddlewaretoken, id: user.id },
        success: (r) => {
          if (r.result) {
            setFallowed(!fallowed);
          } else {
            showMsg("An unknown error has occurred");
          }
        },
        error: () => {
          showMsg("An unknown network error has occurred");
        },
      });
    } else {
      showMsg("Please login");
    }
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
          className={`py-1 px-3 mx-2 rounded-full active:scale-[0.98] transition-all border-2 border-indigo-500 focus-visible:scale-110 ${
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
    if (data.me.id) {
      $.ajax({
        method: "POST",
        url: `/api/fallow/${tag.name}`,
        data: { csrfmiddlewaretoken: data.csrfmiddlewaretoken, id: tag.id },
        success: (r) => {
          if (r.result) {
            setFallowed(!fallowed);
          } else {
            showMsg("An unknown error has occurred");
          }
        },
        error: () => {
          showMsg("An unknown network error has occurred");
        },
      });
    } else {
      showMsg("Please login");
    }
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
        <div className="flex items-center w-full">
          <span
            className={`text-${genColor(tag.id)} text-6xl sm:text-7xl mr-2 `}
          >
            #
          </span>
          <div className="ml-2 w-full overflow-hidden">
            <h1 className="text-xl truncate hover:underline ">
              <Link
                name={`# ${tag.name}`}
                onClick={setTitle}
                to={`/t/${tag.name}`}
                className="hover:underline focus-visible:underline"
              >
                {tag.name}
              </Link>
            </h1>
            <span className="text-gray-500 whitespace-pre">
              {nFormatter(tag.fallowers)} Fallowers
            </span>
          </div>
        </div>
      )}
      {loading ? (
        <div className="py-1 px-3 rounded-full bg-gray-200 relative fadeInLoad overflow-hidden  w-20 h-8" />
      ) : (
        <button
          onClick={fallow}
          className={`py-1 px-3 mx-2 rounded-full active:scale-[0.98] transition-all border-2 border-indigo-500 focus-visible:scale-110 ${
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
  const [time, setTime] = useState(null);
  const [topPosts, setTopPosts] = useState({ items: [], hasNext: true });
  const [topUsers, setTopUsers] = useState({ items: [], hasNext: true });
  const [topTags, setTopTags] = useState({ items: [], hasNext: true });
  const [posts, setPosts] = useState({ items: [], hasNext: true });
  const [tags, setTags] = useState({ items: [], hasNext: true });
  const [users, setUsers] = useState({ items: [], hasNext: true });

  const [searchValue, setSearchValue] = useState("");

  const getTopPosts = () => {
    $.ajax({
      method: "POST",
      url: "/api/top-posts",
      data: {
        csrfmiddlewaretoken: data.csrfmiddlewaretoken,
        page: topPosts.items.length / 15 + 1,
      },
      success: (r) => {
        if (r.result) {
          r["items"] = topPosts.items.concat(r.items);
          r["isReady"] = true;

          setTopPosts(r);
        } else {
          showMsg("An unexpected error occurred");
        }
      },
      error: () => {
        showMsg("An unknown network error has occurred");
        setTimeout(getTopPosts, 10000);
      },
    });
  };

  const getTopUsers = () => {
    $.ajax({
      method: "POST",
      url: "/api/top-users",
      data: {
        csrfmiddlewaretoken: data.csrfmiddlewaretoken,
        page: topUsers.items.length / 15 + 1,
      },
      success: (r) => {
        if (r.result) {
          r["items"] = topUsers.items.concat(r.items);
          r["isReady"] = true;

          setTopUsers(r);
        } else {
          showMsg("An unexpected error occurred");
        }
      },
      error: () => {
        showMsg("An unknown network error has occurred");
        setTimeout(getTopUsers, 10000);
      },
    });
  };

  const getTopTags = () => {
    $.ajax({
      method: "POST",
      url: "/api/top-tags",
      data: {
        csrfmiddlewaretoken: data.csrfmiddlewaretoken,
        page: topTags.items.length / 15 + 1,
      },
      success: (r) => {
        if (r.result) {
          r["items"] = topTags.items.concat(r.items);
          r["isReady"] = true;
          setTopTags(r);
        } else {
          showMsg("An unexpected error occurred");
        }
      },
      error: () => {
        showMsg("An unknown network error has occurred");
        setTimeout(getTopTags, 10000);
      },
    });
  };

  const search = () => {
    clearTimeout(time);
    if (searchValue.replace(/\s+/g, "").length) {
      setTime(
        setTimeout(() => {
          $.ajax({
            method: "POST",
            url: `/api/search-${state}`,
            data: {
              csrfmiddlewaretoken: data.csrfmiddlewaretoken,
              text: searchValue,
              page: posts.items.length / 15 + 1,
            },
            success: (r) => {
              if (r.result) {
                if (state == "users") {
                  r["isReady"] = true;
                  setUsers(r);
                } else if (state == "tags") {
                  r["isReady"] = true;
                  setTags(r);
                } else if (state == "posts") {
                  r["isReady"] = true;
                  setPosts(r);
                }
              } else {
                showMsg("An unknown error has occurred");
              }
            },
            error: () => {
              showMsg("An unknown network error has occurred");
              setTimeout(search, 10000);
            },
          });
        }, 500)
      );
    }
  };

  const getBase = () => {
    $.ajax({
      method: "GET",
      url: "/api/base/search",
      data: {
        csrfmiddlewaretoken: data.csrfmiddlewaretoken,
      },
      success: (r) => {
        setTopPosts({ ...r.posts, ["isReady"]: true });
        setTopTags({ ...r.tags, ["isReady"]: true });
        setTopUsers({ ...r.users, ["isReady"]: true });
        setData({ ...data, ["me"]: r.me || {} });
        data.setIsReady(true);
      },
      error: () => {
        showMsg("An unknown network error has occurred");
        setTimeout(getBase, 10000);
      },
    });
  };

  useEffect(() => {
    getBase();
  }, [1]);

  useEffect(() => {
    search();
  }, [searchValue, state]);

  useEffect(() => {
    const load = document.querySelector("#searchContainer .loading");

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (searchValue.replace(/\s+/g, "").length) {
            search();
          } else {
            if (state == "posts") {
              getTopPosts();
            } else if (state == "users") {
              getTopUsers();
            } else if (state == "tags") {
              getTopTags();
            }
          }
        }
      });
    });
    if (load) {
      observer.observe(load);
    }
  }, [topUsers, topTags, topPosts, posts, users, tags, state]);

  return (
    <main>
      <main className="mt-16 mb-16 sm:m-0 sm:ml-16 flex items-center justify-center">
        <section className="p-6 max-w-6xl w-full">
          <div className="rounded-full w-full flex border-2 border-gray-300  px-2 ">
            <i className="bi bi-search px-1 py-2 text-md sm:text-lg"></i>
            <input
              type="text"
              placeholder="Search"
              onChange={(e) => setSearchValue(e.target.value)}
              dir="auto"
              className="focus:border-0 text-lg sm:text-xl w-full mx-2"
            />
          </div>
          <div>
            <div className="mt-8 border-b-2 text-sm sm:text-base flex justify-between sm:block">
              <button
                onClick={() => {
                  setState("posts");
                }}
                className={`transition-all py-2 px-3 translate-y-[2px] border-b-2 w-full sm:w-auto focus-visible:scale-110  focus-visible:opacity-100 ${
                  state == "posts" ? "border-gray-900" : "opacity-[0.75]"
                }`}
              >
                Posts
              </button>
              <button
                onClick={() => {
                  setState("users");
                }}
                className={`transition-all py-2 px-3 translate-y-[2px] border-b-2 w-full sm:w-auto focus-visible:scale-110  focus-visible:opacity-100 ${
                  state == "users" ? "border-gray-900" : "opacity-[0.75]"
                }`}
              >
                Users
              </button>
              <button
                onClick={() => {
                  setState("tags");
                }}
                className={`transition-all py-2 px-3 translate-y-[2px] border-b-2 w-full sm:w-auto focus-visible:scale-110  focus-visible:opacity-100 ${
                  state == "tags" ? "border-gray-900" : "opacity-[0.75]"
                }`}
              >
                Tags
              </button>
            </div>
            <div id="searchContainer">
              {searchValue.replace(/\s+/g, "")
                ? state == "posts"
                  ? posts.isReady
                    ? posts.items.map((i) => <Post post={i} key={i.id} />)
                    : [1, 2, 3, 4, 5].map((i) => (
                        <Post loading={true} key={i} />
                      ))
                  : state == "users"
                  ? users.isReady
                    ? users.items.map((i) => (
                        <PeopleItem user={i} inSearch={true} key={i.id} />
                      ))
                    : [1, 2, 3, 4, 5].map((i) => (
                        <PeopleItem loading={true} key={i} />
                      ))
                  : state == "tags"
                  ? tags.isReady
                    ? tags.items.map((i) => <TagItem tag={i} key={i.id} />)
                    : [1, 2, 3, 4, 5].map((i) => (
                        <TagItem loading={true} key={i} />
                      ))
                  : ""
                : state == "posts"
                ? topPosts.isReady
                  ? topPosts.items.map((i) => <Post post={i} key={i.id} />)
                  : [1, 2, 3, 4, 5].map((i) => <Post loading={true} key={i} />)
                : state == "users"
                ? topUsers.isReady
                  ? topUsers.items.map((i) => (
                      <PeopleItem user={i} key={i.id} />
                    ))
                  : [1, 2, 3, 4, 5].map((i) => (
                      <PeopleItem loading={true} key={i} />
                    ))
                : state == "tags"
                ? topTags.isReady
                  ? topTags.items.map((i) => <TagItem tag={i} key={i.id} />)
                  : [1, 2, 3, 4, 5].map((i) => (
                      <TagItem loading={true} key={i} />
                    ))
                : ""}
              {((state == "posts" && posts.hasNext && posts.isReady) ||
                (state == "tags" && tags.hasNext && tags.isReady) ||
                (state == "users" && users.hasNext && users.isReady) ||
                (state == "posts" && topPosts.hasNext && topPosts.isReady) ||
                (state == "tags" && topTags.hasNext && topTags.isReady) ||
                (state == "users" && topUsers.hasNext && topUsers.isReady)) && (
                <Loading />
              )}
            </div>
          </div>
        </section>
      </main>
    </main>
  );
};

const BookmarkView = ({}) => {
  const [bookmarks, setBookmarks] = useState({ items: [], hasNext: true });
  const [data, setData] = useContext(Context);

  const getBookmarks = () => {
    $.ajax({
      method: "POST",
      url: "/api/me/bookmarks",
      data: {
        csrfmiddlewaretoken: data.csrfmiddlewaretoken,
        page: bookmarks.items.length / 15 + 1,
      },
      success: (r) => {
        if (r.result) {
          r["items"] = bookmarks.items.concat(r.items);
          r["isReady"] = true;
          setBookmarks(r);
        } else {
          showMsg("An unknown error has occurred");
        }
      },
      error: () => {
        showMsg("An unknown network error has occurred");
        setTimeout(getBookmarks, 10000);
      },
    });
  };

  useEffect(() => {
    const load = document.querySelector("#bookmarksContainer .loading");

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          getBookmarks();
        }
      });
    });
    if (load) {
      observer.observe(load);
    }
  }, [bookmarks]);

  const getBase = () => {
    $.ajax({
      method: "GET",
      url: "/api/base/bookmarks",
      data: {
        csrfmiddlewaretoken: data.csrfmiddlewaretoken,
      },
      success: (r) => {
        if (r.result) {
          setBookmarks({ ...r.bookmarks, ["isReady"]: true });
          setData({ ...data, ["me"]: r.me });
          data.setIsReady(true);
        }
      },
      error: () => {
        showMsg("An unknown network error has occurred");
        setTimeout(getBase, 10000);
      },
    });
  };

  useEffect(() => {
    getBase();
  }, [1]);

  return (
    <main>
      <main className="mt-16 mb-16 sm:m-0 sm:ml-16 flex items-center justify-center">
        <section className="p-6 max-w-6xl w-full">
          <h1 className="text-3xl border-b-2 border-gray-300 mb-2 py-2">
            Bookmarks
          </h1>
          {bookmarks.isReady ? (
            <div id="bookmarksContainer">
              {bookmarks.items.map((p) => (
                <Post post={p} key={p.id} />
              ))}
              {bookmarks.hasNext && bookmarks.isReady ? <Loading /> : ""}
            </div>
          ) : (
            <div>
              {[1, 2, 3, 4, 5].map((i) => (
                <Post loading={true} key={i} />
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
  const [messages, setMessages] = useState({});
  const [isPreview, setIsPreview] = useState(false);
  const [crntTags, setCrntTags] = useState({ items: [], hasNext: true });
  const [topTags, setTopTags] = useState({ items: [], hasNext: true });
  const [srchTag, setSrchTag] = useState("");
  const [saved, setSaved] = useState(false);
  const [is404, setIs404] = useState(false);

  const url = useParams();
  const [post, setPost] = useState({
    csrfmiddlewaretoken: data.csrfmiddlewaretoken,
  });
  const [apiPath, setApiPath] = useState(
    url.id ? `/api/write/${url.id}` : "/api/write"
  );
  const getTopTags = () => {
    $.ajax({
      method: "POST",
      url: `/api/top-tags`,
      data: {
        csrfmiddlewaretoken: data.csrfmiddlewaretoken,
        page: topTags.items.length / 15 + 1,
      },
      success: (r) => {
        if (r.result) {
          r["items"] = topTags.items.concat(r.items);
          r["isReady"] = true;
          setTopTags(r);
        } else {
          showMsg("An unknown error has occurred");
        }
      },
      error: () => {
        showMsg("An unknown network error has occurred");
        setTimeout(getTopTag, 10000);
      },
    });
  };
  const getPost = () => {
    $.ajax({
      method: "POST",
      url: `/api/p/${url.id}`,
      data: { csrfmiddlewaretoken: data.csrfmiddlewaretoken },
      success: (r) => {
        if (r.result) {
          setSaved(true);
          setPost({
            ...r,
            ["csrfmiddlewaretoken"]: data.csrfmiddlewaretoken,
          });
          window.history.pushState(null, null, "/write/" + r.id);
        } else {
          showMsg("An unknown error has occurred");
        }
      },
      error: (xhr) => {
        if (xhr.status == 404) {
          setIs404(true);
        } else {
          showMsg("An unknown network error has occurred");
          setTimeout(getPost, 10000);
        }
      },
    });
  };
  useEffect(() => {
    if (url.id) {
      getPost();
    }
    getTopTags();
    getMyInfo([data, setData]);
  }, [1]);

  const handleChange = (e) => {
    setSaved(false);
    setPost({ ...post, ["date"]: new Date().getTime() });
    setPost({ ...post, [e.target.name]: e.target.value });
  };
  const handleUpload = (e) => {
    showMsg("Processing...");
    const [file] = e.target.files;
    const pyload = new FormData();
    pyload.append("image", file);
    pyload.append("csrfmiddlewaretoken", data.csrfmiddlewaretoken);
    $.ajax({
      method: "POST",
      url: "/api/upload",
      data: pyload,
      contentType: false,
      processData: false,
      success: (r) => {
        if (r.result) {
          navigator.clipboard.writeText(r.link);
          showMsg("Image url copied");
        } else {
          showMsg(r.image || "An unknown error has occurred");
        }
      },
      error: () => {
        showMsg("An unknown network error has occurred");
      },
    });
  };

  const status = () => {
    $.ajax({
      method: "POST",
      url: `/api/write/${post.id}/status`,
      data: { csrfmiddlewaretoken: data.csrfmiddlewaretoken, id: post.id },
      success: (r) => {
        if (r.result) {
          setSaved(true);
          setPost({ ...post, ["isPub"]: r.isPub });
          showMsg(`Successfully ${r.isPub ? "Published" : "Drafted"}`);
        } else {
          showMsg("An unexpected error occurred");
        }
      },
      error: () => {
        showMsg("An unknown network error has occurred");
      },
    });
  };

  const deletePost = () => {
    $.ajax({
      method: "POST",
      url: `/api/delete/${post.id}`,
      data: { csrfmiddlewaretoken: data.csrfmiddlewaretoken },
      success: (r) => {
        if (r.result) {
          setSaved(false);
          setApiPath("/api/write");
          window.history.pushState(null, null, "/write");
          showMsg("Post deleted");
        } else {
          showMsg("An unexpected error occurred");
        }
      },
      error: () => {
        showMsg("An unknown network error has occurred");
      },
    });
  };

  const avTags = () => {
    const av = (
      srchTag.replace(/\W+/g, "").length || crntTags.items.length
        ? crntTags
        : topTags
    ).items.filter(
      (i) =>
        !(post.tags || []).includes(i) &&
        i.name.toLowerCase().startsWith(srchTag.toLowerCase())
    );
    return av.length ? av : false;
  };
  const save = () => {
    if (post.title && post.text) {
      let payload = { ...post, ["slug"]: post.title.replace(/\s+/g, "-") };
      payload["tags"] = "";
      (post.tags || []).map((i) => {
        payload["tags"] += ` . ${i.id}`;
      });

      $.ajax({
        method: "POST",
        url: apiPath,
        data: payload,
        success: (r) => {
          setMessages(r);

          if (r.result) {
            if (r.tags) {
              showMsg(r.tags);
            }
            setSaved(true);
            setApiPath(`/api/write/${r.id || post.id}`);
            setPost({ ...post, ["id"]: r.id });
            window.history.pushState(null, null, "/write/" + (r.id || post.id));
            showMsg("Successfully saved");
          } else {
            setMessages(r);
          }
        },
        error: () => {
          showMsg("An unknown network error has occurred");
        },
      });
    } else {
      showMsg("Fill all fields");
    }
  };

  const searchTag = (e = { target: {} }, append = false) => {
    const text = e.target.value || srchTag;
    $.ajax({
      method: "POST",
      url: "/api/search-tags",
      data: {
        csrfmiddlewaretoken: data.csrfmiddlewaretoken,
        text: text,
        page: crntTags.items.length / 15 + 1,
      },
      success: (r) => {
        if (r.result) {
          if (append) {
            r["items"] = crntTags.items.concat(r.items);
          }
          setCrntTags({ ...r, ["isReady"]: true });
        }
      },
      error: () => {
        showMsg("An unknown network error has occurred");
      },
    });
  };
  useEffect(() => {
    const load = document.querySelector("#tagsContainer .loading");

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (srchTag.replace(/\W+/g, "").length) {
            searchTag({ target: { value: srchTag } }, true);
          } else {
            getTopTags();
          }
        }
      });
    });
    if (load) {
      observer.observe(load);
    }
  }, [srchTag, topTags, crntTags]);

  return (
    <main>
      <main className="mt-16 mb-16 sm:m-0 sm:ml-16 flex items-center justify-center">
        {is404 ? (
          <Page404 />
        ) : (
          <section className="p-6 max-w-6xl w-full">
            <div className="flex items-center justify-between mb-5">
              <div>
                <button className="relative px-4 py-1 border-2 border-gray-300 rounded-full cursor-pointer active:scale-[0.98] active:opacity-90 transition-all focus-visible:scale-110 focus-visible:border-gray-700">
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    className="cursor-pointer w-full h-full opacity-0 absolute right-0 bottom-0"
                  />
                </button>
                {saved ? (
                  <button
                    onClick={deletePost}
                    className="ml-2 text-red-500 relative px-4 py-1 border-2 border-gray-300 rounded-full cursor-pointer active:scale-[0.98] active:opacity-90 transition-all focus-visible:scale-110 focus-visible:border-gray-700"
                  >
                    <span className="hidden sm:inline">Delete</span>
                    <i className="bi bi-trash sm:hidden"></i>
                  </button>
                ) : (
                  ""
                )}
              </div>
              <div className="flex">
                <button
                  onClick={saved ? status : save}
                  className="z-10 top-3 right-3 fixed sm:relative sm:top-0 sm:right-0 px-8 py-2 sm:translate-x-0 sm:translate-y-0 sm:px-4 sm:py-1 bg-gray-900 text-white rounded-full mr-2 cursor-pointer active:scale-[0.98] active:opacity-90 transition-all focus-visible:scale-110 "
                >
                  {saved ? (post.isPub ? "Draft" : "Publish") : "Save"}
                </button>
                <button
                  onClick={() => setIsPreview(!isPreview)}
                  className="px-4 py-1 border-2 border-gray-300 rounded-full cursor-pointer active:scale-[0.98] active:opacity-90 transition-all focus-visible:scale-110 focus-visible:border-gray-700"
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
                          {Math.ceil(
                            (cleanMd(post.text || "") || "").split(" ").length /
                              200
                          )}{" "}
                          min <span className="hidden sm:inline">read</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="tags flex mt-3 items-center justify-between">
                  <div className="relative flex items-center whitespace-pre w-[calc(100%-1rem)] overflow-hidden  after:bg-gradient-to-l after:from-white after:to-transparent after:right-0 after:absolute after:h-full after:w-6">
                    {post.tags &&
                      post.tags.map((i) => <Tag tag={i} key={i.id} />)}
                  </div>
                </div>

                <article
                  dir="auto"
                  className="post-body mt-2"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      marked.parse(
                        `# ` +
                          (post.title || "Title") +
                          `\n` +
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
                    messages.title || messages.slug
                      ? "text-red-500"
                      : "text-gray-700"
                  } text-sm`}
                >
                  {messages.title ||
                    messages.slug ||
                    "Show on top of post and other people can find your post with it."}
                </span>
                <div className="flex flex-col sm:flex-row">
                  <div className="">
                    {post.tags &&
                      post.tags.map((i) => (
                        <span
                          key={i.id}
                          className="p-1 border-b-[1px] border-gray-300 mr-2"
                        >
                          <span className={`text-${genColor(i.id)}`}>
                            #
                            <span className="ml-1 text-gray-700">{i.name}</span>
                          </span>
                          <i
                            className="bi bi-x p-1 cursor-pointer"
                            onClick={() => {
                              setPost({
                                ...post,
                                ["tags"]: (post.tags || []).filter(
                                  (pt) => pt.id != i.id
                                ),
                              });
                            }}
                          />
                        </span>
                      ))}
                  </div>
                  <div className="relative group mt-2 sm:mt-0">
                    {!post.tags || post.tags.length < 3 ? (
                      <input
                        autoComplete="none"
                        type="text"
                        id="tagInput"
                        className="w-full"
                        placeholder="Add tags"
                        onChange={(e) => {
                          searchTag(e);
                          setSrchTag(e.target.value);
                        }}
                        defaultValue={srchTag}
                      />
                    ) : (
                      ""
                    )}
                    <ul
                      id="tagsContainer"
                      className=" rounded-xl absolute top-[2rem] left-0 bg-gray-100 shadow-xl h-64 overflow-auto opacity-0 pointer-events-none group-focus-within:opacity-100 group-focus-within:pointer-events-auto w-64"
                    >
                      {(
                        avTags() ||
                        (!srchTag.includes(" ")
                          ? [{ id: srchTag, name: srchTag }]
                          : [])
                      ).map((i) => (
                        <li key={i.id}>
                          <button
                            onClick={() => {
                              setPost({
                                ...post,
                                ["tags"]: (post.tags || []).concat(i),
                              });
                              $("#tagInput").val("");
                              setSaved(false);
                            }}
                            className="w-full flex  hover:bg-gray-200 px-3 focus-visible:bg-gray-200  py-2"
                          >
                            <div className="flex items-center w-full">
                              <span
                                className={`text-${genColor(
                                  i.id
                                )} text-5xl mr-2 `}
                              >
                                #
                              </span>
                              <div className="flex flex-col items-start">
                                <h1
                                  name={`# ${i.name}`}
                                  className="text-md truncate contents"
                                >
                                  {i.name}
                                </h1>
                                <span className="text-sm text-gray-500 ">
                                  {nFormatter(i.fallowers || 0)} Fallowers
                                </span>
                              </div>
                            </div>
                          </button>
                        </li>
                      ))}
                      {(topTags.hasNext && topTags.isReady) ||
                      (crntTags.hasNext && crntTags.isReady) ? (
                        <div className="w-full py-3 loading text-xl text-center">
                          ...
                        </div>
                      ) : (
                        ""
                      )}
                    </ul>
                  </div>
                </div>
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
                        className="text-indigo-500 mx-1 contents"
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
        )}
      </main>
    </main>
  );
};

const MeView = ({}) => {
  const [data, setData] = useContext(Context);
  const [state, setState] = useState("drafts");
  const [showSide, setShowSide] = useState(null);
  const [posts, setPosts] = useState({ items: [], hasNext: true });
  const [dposts, setDposts] = useState({ items: [], hasNext: true });
  const [fallowers, setFallowers] = useState({ items: [], hasNext: true });
  const [fallowings, setFallowings] = useState({ items: [], hasNext: true });
  const [tags, setTags] = useState({ items: [], hasNext: true });

  const getPosts = () => {
    $.ajax({
      method: "POST",
      url: "/api/me/posts",
      data: {
        csrfmiddlewaretoken: data.csrfmiddlewaretoken,
        page: posts.items.length / 15 + 1,
      },
      success: (r) => {
        if (r.result) {
          r["items"] = posts.items.concat(r.items);
          r["isReady"] = true;
          setPosts(r);
        } else {
          showMsg("An unexpected error occurred");
        }
      },
      error: () => {
        showMsg("An unknown network error has occurred");
        setTimeout(getPosts, 10000);
      },
    });
  };

  const getDposts = () => {
    $.ajax({
      method: "POST",
      url: "/api/me/dposts",
      data: {
        csrfmiddlewaretoken: data.csrfmiddlewaretoken,
        page: dposts.items.length / 15 + 1,
      },
      success: (r) => {
        if (r.result) {
          r["items"] = dposts.items.concat(r.items);
          r["isReady"] = true;
          setDposts(r);
        } else {
          showMsg("An unexpected error occurred");
        }
      },
      error: () => {
        showMsg("An unknown network error has occurred");
        setTimeout(getDposts, 10000);
      },
    });
  };
  const getFallowers = () => {
    $.ajax({
      method: "POST",
      url: "/api/me/fallowers",
      data: {
        csrfmiddlewaretoken: data.csrfmiddlewaretoken,
        page: fallowers.items.length / 15,
      },
      success: (r) => {
        if (r.result) {
          r["items"] = fallowers.items.concat(r.items);
          r["isReady"] = true;
          setFallowers(r);
        } else {
          showMsg("An unexpected error occurred");
        }
      },
      error: () => {
        showMsg("An unknown network error has occurred");
        setTimeout(getFallowers, 10000);
      },
    });
  };

  const getFallowings = () => {
    $.ajax({
      method: "POST",
      url: "/api/me/fallowings",
      data: {
        csrfmiddlewaretoken: data.csrfmiddlewaretoken,
        page: fallowings.items.length / 15 + 1,
      },
      success: (r) => {
        if (r.result) {
          r["items"] = fallowings.items.concat(r.items);
          r["isReady"] = true;
          setFallowings(r);
        } else {
          showMsg("An unexpected error occurred");
        }
      },
      error: () => {
        showMsg("An unknown network error has occurred");
        setTimeout(getFallowings, 10000);
      },
    });
  };
  const getTags = () => {
    $.ajax({
      method: "POST",
      url: "/api/me/tags",
      data: {
        csrfmiddlewaretoken: data.csrfmiddlewaretoken,
        page: tags.items.length / 15 + 1,
      },
      success: (r) => {
        if (r.result) {
          r["items"] = tags.items.concat(r.items);
          r["isReady"] = true;
          setTags(r);
        } else {
          showMsg("An unexpected error occurred");
        }
      },
      error: () => {
        showMsg("An unknown network error has occurred");
        setTimeout(getTags, 10000);
      },
    });
  };

  const getBase = () => {
    $.ajax({
      method: "GET",
      url: "/api/base/me",
      data: { csrfmiddlewaretoken: data.csrfmiddlewaretoken },
      success: (r) => {
        if (r.result) {
          setPosts({ ...r.posts, ["isReady"]: true });
          setDposts({ ...r.dposts, ["isReady"]: true });
          setData({ ...data, ["me"]: r.me || {} });
          data.setIsReady(true);
        }
      },
      error: () => {
        showMsg("An unknown network error has occurred");
        setTimeout(getBase, 10000);
      },
    });
  };

  useEffect(() => {
    getBase();
  }, [1]);

  const closeSide = (e) => {
    if (e.target.id == "close") {
      setShowSide(null);
      setFallowings({ items: [], hasNext: true });
      setFallowers({ items: [], hasNext: true });
      setTags({ items: [], hasNext: true });
    }
  };

  const Container = ({ sideName }) => {
    useEffect(() => {
      if (sideName == "tags") {
        getTags();
      } else if (sideName == "fallowings") {
        getFallowings();
      } else if (sideName == "fallowers") {
        getFallowers();
      }
    }, [1]);

    useEffect(() => {
      const load = document.querySelector("#postsContainer .loading");

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (sideName == "fallowings") {
              getFallowings();
            } else if (sideName == "fallowers") {
              getFallowers();
            } else if (sideName == "tags") {
              getTags();
            }
          }
        });
      });
      if (load) {
        observer.observe(load);
      }
    }, [fallowers, fallowings, tags]);

    return (
      <div
        id="close"
        onClick={closeSide}
        className={`bg-[#00000078] backdrop-blur-sm fixed w-screen h-screen right-0 top-0 flex flex-col-reverse sm:flex-row-reverse z-20 `}
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

          <div
            id="itemsContainer"
            className="overflow-auto h-full sm:ml-4 px-2 pb-2"
          >
            {sideName == "tags" && tags.isReady
              ? tags.items.map((item) => <TagItem tag={item} key={item.id} />)
              : sideName == "tags"
              ? [1, 2, 3, 4, 5, , 6, 7, 8, 9].map((item) => (
                  <TagItem loading={true} key={item.id} />
                ))
              : ""}

            {sideName == "fallowers" && fallowers.isReady
              ? fallowers.items.map((item) => (
                  <PeopleItem user={item} key={item.id} />
                ))
              : sideName == "fallowers"
              ? [1, 2, 3, 4, 5, , 6, 7, 8, 9].map((item) => (
                  <PeopleItem loading={true} key={item.id} />
                ))
              : ""}

            {sideName == "fallowings" && fallowings.isReady
              ? fallowings.items.map((item) => (
                  <PeopleItem user={item} key={item.id} />
                ))
              : sideName == "fallowings"
              ? [1, 2, 3, 4, 5, , 6, 7, 8, 9].map((item) => (
                  <PeopleItem loading={true} key={item} />
                ))
              : ""}

            {(sideName == "fallowings" &&
              fallowings.isReady &&
              fallowings.hasNext) ||
            (sideName == "fallowers" &&
              fallowers.isReady &&
              fallowers.hasNext) ||
            (sideName == "tags" && tags.isReady && tags.hasNext) ? (
              <Loading />
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const load = document.querySelector("#postsContainer .loading");

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (state == "pubs") {
            getPosts();
          } else {
            getDposts();
          }
        }
      });
    });
    if (load) {
      observer.observe(load);
    }
  }, [posts, dposts]);
  return (
    <main>
      <main className="mt-16 mb-16 sm:m-0 sm:ml-16 sm:flex items-center justify-center">
        <section className="p-6 max-w-6xl w-full">
          {data.me.id ? (
            <div>
              <div className="flex justify-between items-center">
                <img
                  src={data.me.profile}
                  alt={`${data.me.name}'s image`}
                  className="w-24 h-24 sm:h-36 sm:w-36 lg:h-46 lg:w-46 rounded-full"
                />

                <div className="flex w-full justify-around">
                  <button
                    onClick={() => {
                      setShowSide("fallowers");
                    }}
                    className="flex flex-col sm:flex-row items-center focus-visible:scale-110  "
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
                    onClick={() => {
                      setShowSide("fallowings");
                    }}
                    className="flex flex-col sm:flex-row items-center focus-visible:scale-110  "
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
                    onClick={() => {
                      setShowSide("tags");
                    }}
                    className="flex flex-col sm:flex-row items-center focus-visible:scale-110  "
                  >
                    {nFormatter(data.me.tags)}
                    <span className="text-gray-500 sm:ml-2">Tags</span>
                  </button>
                  {showSide == "tags" ? <Container sideName="tags" /> : ""}
                </div>
              </div>
              <h1 className="py-1 text-2xl">{data.me.name}</h1>
              <p className=" text-gray-700">{data.me.bio}</p>
            </div>
          ) : (
            <div>
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
            </div>
          )}

          <div className="mt-8 border-b-2 text-sm sm:text-base flex justify-between sm:block">
            <button
              onClick={() => {
                if (dposts.items.length == 0) {
                  getDposts();
                }
                setState("drafts");
              }}
              className={`transition-all py-2 px-3 translate-y-[2px] border-b-2 w-full sm:w-auto focus-visible:scale-110  focus-visible:opacity-100 ${
                state == "drafts" ? "border-gray-900" : "opacity-[0.75]"
              }`}
            >
              Drafts
            </button>
            <button
              onClick={() => {
                if (posts.items.length == 0) {
                  getPosts();
                }
                setState("pubs");
              }}
              className={`transition-all py-2 px-3 translate-y-[2px] border-b-2 w-full sm:w-auto focus-visible:scale-110  focus-visible:opacity-100 ${
                state == "pubs" ? "border-gray-900" : "opacity-[0.75]"
              }`}
            >
              Publications
            </button>
          </div>
          <div id="postsContainer">
            {state == "pubs" &&
              posts.items.map((i) => <Post post={i} key={i.id} />)}
            {state == "drafts" &&
              dposts.items.map((i) => <Post post={i} key={i.id} />)}
            {(state == "drafts" && !dposts.isReady) ||
            (state == "pubs" && !posts.isReady)
              ? [1, 2, 3, 4, 5].map((i) => <Post loading={true} key={i} />)
              : ""}
            {(state == "drafts" && dposts.isReady && dposts.hasNext) ||
            (state == "pubs" && posts.isReady && posts.hasNext) ? (
              <Loading />
            ) : (
              ""
            )}
          </div>
        </section>
      </main>
    </main>
  );
};

const PeopleView = ({}) => {
  const [data, setData] = useContext(Context);
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState({ items: [], hasNext: true });
  const url = useParams();

  const getBase = () => {
    $.ajax({
      method: "GET",
      url: `/api/base/@${url.username}`,
      data: { csrfmiddlewaretoken: data.csrfmiddlewaretoken },
      success: (r) => {
        setUser(r.user);
        setPosts({ ...r.posts, ["isReady"]: true });
        setData({ ...data, ["me"]: r.me });
        data.setIsReady(true);
      },
      error: () => {
        if (xhr.status == 404) {
          setIs404(true);
        } else {
          showMsg("An unknown network error has occurred");
          setTimeout(getUser, 10000);
        }
      },
    });
  };

  const getPosts = () => {
    $.ajax({
      method: "POST",
      url: `/api/posts/@${url.username}`,
      data: {
        csrfmiddlewaretoken: data.csrfmiddlewaretoken,
        page: posts.items.length / 15 + 1,
      },
      success: (r) => {
        if (r.result) {
          r["items"] = posts.items.concat(r.items);
          r["isReady"] = true;
          setPosts(r);
        } else {
          showMsg("An unknown error has occurred");
        }
      },
      error: () => {
        showMsg("An unknown network error has occurred");
        setTimeout(getPosts, 10000);
      },
    });
  };
  useEffect(() => {
    const load = document.querySelector("#postsContainer .loading");

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          getPosts();
        }
      });
    });
    if (load) {
      observer.observe(load);
    }
  }, [posts]);

  useEffect(() => {
    getBase();
  }, [1]);

  const fallow = () => {
    if (data.me.id) {
      $.ajax({
        method: "POST",
        url: `/api/fallow/@${user.username}`,
        data: { csrfmiddlewaretoken: data.csrfmiddlewaretoken, id: user.id },
        success: (r) => {
          if (r.result) {
            setUser({ ...user, ["fallowed"]: !user.fallowed });
          } else {
            showMsg("An unknown error has occurred");
          }
        },
        error: () => {
          showMsg("An unknown network error has occurred");
        },
      });
    } else {
      showMsg("Please login");
    }
  };

  return (
    <main>
      <main className="mt-16 mb-16 sm:m-0 sm:ml-16 flex items-center justify-center">
        <section className="p-6 max-w-6xl w-full">
          {user.id ? (
            <div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <img
                    src={user.profile}
                    alt={`${user.name}'s image`}
                    className="h-14 w-14 sm:h-16 sm:w-16 rounded-full"
                  />
                  <div className=" ml-2 overflow-hidden">
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
                  className={`py-1 px-3 mx-2 rounded-full active:scale-[0.98] transition-all border-2 border-indigo-500 focus-visible:scale-110 ${
                    user.fallowed
                      ? "text-indigo-500  bg-white"
                      : "text-white bg-indigo-500"
                  } `}
                >
                  {user.fallowed ? "Unfallow" : "Fallow"}
                </button>
              </div>
              <p dir="auto" className="my-4 text-gray-700">{user.bio}</p>
            </div>
          ) : (
            <div>
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
            </div>
          )}
          <div className="mt-8 border-b-2 border-gray-400 flex ">
            <button className="py-2 px-3 border-b-2 border-gray-900 translate-y-[2px] opacity-90 ">
              Home
            </button>
          </div>
          <div id="postsContainer">
            {posts.isReady
              ? posts.items.map((i) => <Post post={i} key={i.id} />)
              : [1, 2, 3, 4, 5].map((i) => <Post loading={true} key={i} />)}
            {posts.hasNext && posts.isReady ? <Loading /> : ""}
          </div>
        </section>
      </main>
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

  useEffect(() => {
    getMyInfo([data, setData]);
  }, [1]);

  const Container = ({ sideName, title, about, btn, func }) => {
    const [pass, setPass] = useState("");

    const deleteAccount = () => {
      $.ajax({
        method: "POST",
        url: "/api/accounts/delete",
        data: { csrfmiddlewaretoken: data.csrfmiddlewaretoken, password: pass },
        success: (r) => {
          if (r.result) {
            document.location = "/";
          } else {
            setMessages(r);
          }
        },
        error: () => {
          setShowSide(null);
          showMsg("An unknown network error has occurred");
        },
      });
    };
    return (
      <div
        id="close"
        onClick={closeSide}
        className={`${
          showSide == sideName
            ? "bg-[#00000078]"
            : "pointer-events-none opacity-0"
        } fixed flex h-screen items-center justify-center right-0 top-0 w-screen z-20 transition-all backdrop-blur-sm`}
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
                onChange={(e) => setPass(e.target.value)}
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
              onClick={showSide == "delete" ? deleteAccount : func}
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
      showMsg("Processing...");
      const [file] = e.target.files;
      setIsLoading(true);
      const pyload = new FormData();
      pyload.append("profile", file);
      pyload.append("csrfmiddlewaretoken", data.csrfmiddlewaretoken);
      $.ajax({
        method: "POST",
        url: "/api/me/edit",
        data: pyload,
        contentType: false,
        processData: false,
        success: (r) => {
          if (r.result) {
            setData({ ...data, ["me"]: r.me });
            setIsLoading(false);
            setEditField(null);
            setFormData({});
          } else {
            showMsg(r.profile || "An unknown error has occurred");
          }
        },
        error: () => {
          showMsg("An unknown network error has occurred");
        },
      });
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
    $.ajax({
      method: "POST",
      url: "/api/accounts/kill-other",
      data: { csrfmiddlewaretoken: data.csrfmiddlewaretoken },
      success: (r) => {
        setShowSide(null);
        if (r.result) {
          showMsg("Successfully killed");
        } else {
          showMsg("An unknown error has occurred");
        }
      },
      error: () => {
        setShowSide(null);
        showMsg("An unknown network error has occurred");
      },
    });
  };

  const signOut = () => {
    $.ajax({
      method: "POST",
      url: "/api/accounts/log-out",
      data: { csrfmiddlewaretoken: data.csrfmiddlewaretoken },
      success: (r) => {
        setIsLoading(false);
        if (r.result) {
          document.location = "/";
        } else {
          setMessages(r);
        }
      },
      error: () => {
        setShowSide(null);
        showMsg("An unknown network error has occurred");
      },
    });
  };

  const closeSide = (e) => {
    if (e.target.id == "close") {
      setShowSide(null);
      setMessages({});
      setIsLoading(false);
      setEditField(null);
    }
  };

  const changePassword = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const pyload = formData;
    pyload["csrfmiddlewaretoken"] = data.csrfmiddlewaretoken;
    $.ajax({
      method: "POST",
      url: "/api/accounts/change-password",
      data: pyload,
      success: (r) => {
        setIsLoading(false);
        if (r.result) {
          setData({ ...data, ["csrfmiddlewaretoken"]: r.csrfmiddlewaretoken });
          setShowSide(null);
          setFormData({});
          showMsg("Password successfully changed.");
        } else {
          setMessages(r);
        }
      },
      error: () => {
        setShowSide(null);
        setFormData({});
        showMsg("An unknown network error has occurred");
      },
    });
  };

  const save = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const pyload = formData;
    pyload["csrfmiddlewaretoken"] = data.csrfmiddlewaretoken;
    $.ajax({
      method: "POST",
      url: "/api/me/edit",
      data: pyload,
      success: (r) => {
        setIsLoading(false);
        if (r.result) {
          setData({ ...data, ["me"]: r.me });
          setEditField(null);
          setFormData({});
          showMsg("Successfully changed");
        }
        setMessages(r);
      },
      error: () => {
        setIsLoading(false);
        setEditField(null);
        setFormData({});
        showMsg("An unknown network error has occurred");
      },
    });
  };

  return (
    <main>
      <main className="mt-16 mb-16 sm:m-0 sm:ml-16 flex items-center justify-center">
        {data.me.id ? (
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
                  onChange={manageForm}
                  className="w-full h-full absolute cursor-pointer opacity-0 z-[2]"
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

            <form
              onSubmit={save}
              className="flex justify-between mb-6 relative"
            >
              <div className="w-3/4">
                <h2 className="py-1 text-xl">Username</h2>
                {editField == "username" ? (
                  <input
                    defaultValue={data.me.username}
                    type="text"
                    name="username"
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
                  other people can find you with this username.
                </p>
              </div>
              <div className="absolute right-0">
                {editField == "username" ? (
                  <div>
                    <button
                      type="submit"
                      onClick={save}
                      className={`text-white bg-indigo-500 whitespace-pre py-1 px-5  border-r-0 border-2 border-indigo-500 rounded-br-none rounded-tr-none rounded-full active:scale-[0.98] active:opacity-90 transition-all  ${
                        isLoading && !showSide ? "opacity-75 cursor-wait" : ""
                      }`}
                    >
                      {isLoading && !showSide ? "Saving..." : "Save"}
                    </button>
                    <button
                      id="close"
                      type="reset"
                      onClick={closeSide}
                      className="whitespace-pre py-1 px-3  border-2 border-gray-300 rounded-bl-none rounded-tl-none rounded-full active:scale-[0.98] active:opacity-90 transition-all hover:border-gray-700 focus-visible:border-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditField("username")}
                    className="whitespace-pre py-1 px-3  border-2 border-gray-300 rounded-full active:scale-[0.98] active:opacity-90 transition-all hover:border-gray-700 focus-visible:border-gray-700"
                  >
                    Edit
                  </button>
                )}
              </div>
            </form>

            <form
              onSubmit={save}
              className="flex justify-between mb-6 relative"
            >
              <div className="w-3/4">
                <h2 className="py-1 text-xl">Name</h2>
                {editField == "name" ? (
                  <input
                    onChange={manageForm}
                    defaultValue={data.me.name}
                    type="text"
                    maxLength={50}
                    placeholder="Your name"
                    dir="auto"
                    name="name"
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
                      className="whitespace-pre py-1 px-3  border-2 border-gray-300 rounded-bl-none rounded-tl-none rounded-full active:scale-[0.98] active:opacity-90 transition-all hover:border-gray-700 focus-visible:border-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditField("name")}
                    className="whitespace-pre py-1 px-3  border-2 border-gray-300 rounded-full active:scale-[0.98] active:opacity-90 transition-all hover:border-gray-700 focus-visible:border-gray-700"
                  >
                    Edit
                  </button>
                )}
              </div>
            </form>

            <form
              onSubmit={save}
              className="flex justify-between mb-6 relative"
            >
              <div className="w-3/4">
                <h2 className="py-1 text-xl">Bio</h2>
                {editField == "bio" ? (
                  <input
                    onChange={manageForm}
                    dir="auto"
                    defaultValue={data.me.bio}
                    type="text"
                    name="bio"
                    maxLength={150}
                    placeholder="Add your bio"
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
                      className="whitespace-pre py-1 px-3  border-2 border-gray-300 rounded-bl-none rounded-tl-none rounded-full active:scale-[0.98] active:opacity-90 transition-all hover:border-gray-700 focus-visible:border-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditField("bio")}
                    className="whitespace-pre py-1 px-3  border-2 border-gray-300 rounded-full active:scale-[0.98] active:opacity-90 transition-all hover:border-gray-700 focus-visible:border-gray-700"
                  >
                    Edit
                  </button>
                )}
              </div>
            </form>

            <form
              onSubmit={save}
              className="flex justify-between mb-6 relative"
            >
              <div className="w-3/4">
                <h2 className="py-1 text-xl">Email</h2>
                {editField == "email" ? (
                  <input
                    onChange={manageForm}
                    defaultValue={data.me.email}
                    type="email"
                    placeholder="email address"
                    name="email"
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
                      className="whitespace-pre py-1 px-3  border-2 border-gray-300 rounded-bl-none rounded-tl-none rounded-full active:scale-[0.98] active:opacity-90 transition-all hover:border-gray-700 focus-visible:border-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditField("email")}
                    className="whitespace-pre py-1 px-3  border-2 border-gray-300 rounded-full active:scale-[0.98] active:opacity-90 transition-all hover:border-gray-700 focus-visible:border-gray-700"
                  >
                    Edit
                  </button>
                )}
              </div>
            </form>

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
                    setIsLoading(false);
                  }}
                  className="whitespace-pre py-1 px-3  border-2 border-gray-300 rounded-full active:scale-[0.98] active:opacity-90 transition-all hover:border-gray-700 focus-visible:border-gray-700"
                >
                  Change
                </button>
              </div>
              {showSide == "changePassword" ? (
                <div
                  id="close"
                  onClick={closeSide}
                  className={`bg-[#00000078] backdrop-blur-sm fixed w-screen h-screen right-0 top-0 flex flex-col-reverse sm:flex-row-reverse z-20 ${
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
                    } overflow-auto transition-all border-2 border-gray-100 flex flex-col bg-white absolute rounded-tr-3xl rounded-tl-3xl w-full h-4/5 sm:rounded-tr-none sm:rounded-bl-3xl sm:h-full sm:w-[28rem]`}
                  >
                    <button
                      id="close"
                      className="p-2 w-full flex items-center justify-center sm:w-auto sm:h-full sm:left-0 sm:absolute"
                    >
                      <div className="rounded-full bg-gray-200 w-20 h-1 sm:h-20 sm:w-1"></div>
                    </button>
                    <form
                      onSubmit={changePassword}
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
                          name="old_password"
                          placeholder="Current password"
                          autoComplete="current-password"
                          onChange={manageForm}
                          required={true}
                        />
                        <span
                          className={`text-sm text-red-500 pt-1 ${
                            messages.old_password ? "opacity-100" : "opacity-0"
                          }`}
                        >
                          {messages.old_password || "."}
                        </span>
                      </div>
                      <div className="w-full my-1 text-lg flex flex-col">
                        <input
                          className="border-gray-300 border-b-2 py-1 placeholder:text-gray-600 w-full focus:border-gray-500 focus:placeholder:text-gray-700"
                          type="password"
                          name="new_password1"
                          placeholder="New password"
                          autoComplete="new-password"
                          onChange={manageForm}
                          pattern=".{8,}"
                          required={true}
                        />
                        <span
                          className={`text-sm text-red-500 pt-1 ${
                            messages.new_password1 ? "opacity-100" : "opacity-0"
                          }`}
                        >
                          {messages.new_password1 || "Password is too short."}
                        </span>
                      </div>
                      <div className="w-full my-1 text-lg flex flex-col">
                        <input
                          className="border-gray-300 border-b-2 py-1 placeholder:text-gray-600 w-full focus:border-gray-500 focus:placeholder:text-gray-700"
                          type="password"
                          name="new_password2"
                          placeholder="Retype new password"
                          autoComplete="new-password"
                          onChange={manageForm}
                          required={true}
                        />
                        <span
                          className={`text-sm text-red-500 pt-1 ${
                            messages.new_password2 ? "opacity-100" : "opacity-0"
                          }`}
                        >
                          {messages.new_password2 || "."}
                        </span>
                      </div>
                      <button
                        type="submit"
                        disabled={
                          !(
                            formData.old_password &&
                            formData.new_password1 == formData.new_password2
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
              ) : (
                ""
              )}
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
                  className="whitespace-pre py-1 px-3  border-2 border-gray-300 rounded-full active:scale-[0.98] active:opacity-90 transition-all hover:border-gray-700 focus-visible:border-gray-700"
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
                  className="whitespace-pre py-1 px-3  border-2 border-gray-300 rounded-full active:scale-[0.98] active:opacity-90 transition-all hover:border-gray-700 focus-visible:border-gray-700"
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
                  className="whitespace-pre py-1 px-3  border-2 border-gray-300 rounded-full active:scale-[0.98] active:opacity-90 transition-all hover:border-gray-700 focus-visible:border-gray-700"
                >
                  Delete
                </button>
              </div>
              {showSide == "delete" ? (
                <Container
                  sideName="delete"
                  title="Delete your account?"
                  about="Permanently delete your account and all of your contents"
                  btn="Delete"
                  func={null}
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
  const [is404, setIs404] = useState(false);
  const [posts, setPosts] = useState({ items: [], hasNext: true });
  const [showComments, setShowComments] = useState(false);

  const url = useParams();

  const getPost = (username = url.username, slug = url.postSlug) => {
    $.ajax({
      method: "POST",
      url: `/api/@${username}/${slug}`,
      data: { csrfmiddlewaretoken: data.csrfmiddlewaretoken },
      success: (r) => {
        setPost({ ...r.post, ["isReady"]: true });
        setPosts({ ...r.posts, ["isReady"]: true });
        setData({ ...data, ["me"]: r.me || {} });
        data.setIsReady(true);
      },
      error: (xhr) => {
        if (xhr.status == 404) {
          setIs404(true);
        } else {
          showMsg("An unknown network error has occurred");
          setTimeout(getPost, 10000);
        }
      },
    });
  };
  const getPosts = (username = url.username) => {
    $.ajax({
      method: "POST",
      url: `/api/posts/@${username}`,
      data: {
        csrfmiddlewaretoken: data.csrfmiddlewaretoken,
        page: posts.items.length / 15 + 1,
      },
      success: (r) => {
        if (r.result) {
          r["items"] = posts.items.concat(r.items);
          r["isReady"] = true;
          setPosts(r);
        } else {
          showMsg("An unknown error has occurred");
        }
      },
      error: () => {
        showMsg("An unknown network error has occurred");
        setTimeout(getPosts, 10000);
      },
    });
  };

  useEffect(() => {
    getPost();
  }, [1]);

  useEffect(() => {
    const load = document.querySelector("#postsContainer .loading");

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          getPosts();
        }
      });
    });
    if (load) {
      observer.observe(load);
    }
  }, [posts]);

  const fallow = () => {
    if (data.me.id) {
      $.ajax({
        method: "POST",
        url: `/api/fallow/@${post.user.username}`,
        data: {
          csrfmiddlewaretoken: data.csrfmiddlewaretoken,
          id: post.user.id,
        },
        success: (r) => {
          if (r.result) {
            setPost({
              ...post,
              ["user"]: { ...post.user, ["fallowed"]: !post.user.fallowed },
            });
          }
        },
        error: () => {
          showMsg("An unknown network error has occurred");
        },
      });
    } else {
      showMsg("Please login");
    }
  };

  const bookmark = () => {
    if (data.me.id) {
      $.ajax({
        method: "POST",
        url: `/api/@${post.user.username}/${post.slug}/bookmark`,
        data: { csrfmiddlewaretoken: data.csrfmiddlewaretoken, id: post.id },
        success: (r) => {
          if (r.result) {
            setPost({ ...post, ["bookmark"]: !post.bookmark });
          }
        },
        error: () => {
          showMsg("An unknown network error has occurred");
        },
      });
    } else {
      showMsg("Please login");
    }
  };

  const like = () => {
    if (data.me.id) {
      $.ajax({
        method: "POST",
        url: `/api/@${post.user.username}/${post.slug}/like`,
        data: { csrfmiddlewaretoken: data.csrfmiddlewaretoken, id: post.id },
        success: (r) => {
          if (r.result) {
            setPost({
              ...post,
              ["likes"]: post.liked ? post.likes - 1 : post.likes + 1,
            });
            setPost({ ...post, ["liked"]: !post.liked });
          }
        },
        error: () => {
          showMsg("An unknown network error has occurred");
        },
      });
    } else {
      showMsg("Please login");
    }
  };

  const closeSide = (e) => {
    if (e.target.id == "close") {
      setShowComments(false);
    }
  };

  const Container = ({}) => {
    const [comments, setComments] = useState({ items: [], hasNext: true });
    const [replayTo, setReplayTo] = useState(null);

    const addComment = (e) => {
      const text = e.target.parentElement.children[1].value;
      $.ajax({
        method: "POST",
        url: "/api/add-comment",
        data: {
          csrfmiddlewaretoken: data.csrfmiddlewaretoken,
          text: text,
          post: post.id,
          replaied_to: replayTo ? replayTo.id : null,
        },
        success: (r) => {
          if (r.result) {
            $("#commentInput").val("");
            if (replayTo) {
              setComments({
                ...comments,
                ["items"]: comments.items.map((i) =>
                  i.id == r.comment.replaied_to
                    ? {
                        ...i,
                        ["responses"]: (i.responses || []).concat(r.comment),
                      }
                    : i
                ),
              });
            } else {
              const comms = comments.items.copyWithin();
              comms.unshift(r.comment);
              setComments({ ...comments, ["items"]: comms });
            }
            setReplayTo(null);
          } else {
            showMsg("An unknown error has occurred");
          }
        },
        error: () => {
          showMsg("An unknown network error has occurred");
          setTimeout(addComment, 10000);
        },
      });
    };

    const Comment = ({ comment, loading }) => {
      if (loading) {
        return (
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
        return (
          <div className="sm:first:mt-2 px-2 py-2">
            <div className="border-2 border-gray-100 rounded-lg  px-2 py-1 my-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center w-full overflow-hidden">
                  <img
                    src={comment.user.profile}
                    alt={`${comment.user.name}'s image`}
                    className="h-12 w-12 rounded-full p-1 overflow-hidden"
                  />
                  <div className="flex flex-col p-1 max-w-5/6">
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
              </div>
              <p className="text-sm mt-1  text-gray-800">
                {comment.text}
                <span
                  onClick={() => setReplayTo(comment)}
                  className="ml-2 pt-2 text-indigo-500 cursor-pointer"
                >
                  "Replay"
                </span>
              </p>
            </div>
            <div className="ml-6 my-2">
              {(comment.responses || []).map((i) => (
                <div
                  key={i.id}
                  className="flex items-center w-full justify-start relative"
                >
                  {(comment.responses || []).at(-1).id != i.id ? (
                    <div className="absolute w-2 border-l-2 border-l-gray-300 h-full left-6 top-0 translate-y-1"></div>
                  ) : (
                    ""
                  )}
                  <img
                    src={i.user.profile}
                    alt={`${i.user.name}'s image`}
                    className="h-12 w-12 rounded-full p-1 mb-auto mr-2 z-[2] overflow-hidden"
                  />
                  <div className="flex flex-col w-[calc(100%-52px)] border-2 border-gray-100 rounded-lg  p-2 my-1">
                    <Link
                      name={i.user.name}
                      onClick={setTitle}
                      to={`/@${i.user.username}`}
                      className="text-md w-[80%] truncate"
                    >
                      {i.user.name}
                    </Link>
                    <span>
                      <span className="text-gray-500 text-sm">
                        {timeSince(i.date)}
                      </span>
                      <span className="text-gray-400 mx-1">•</span>
                      <span className="text-gray-500 text-sm">
                        Replaying to
                        <Link
                          name={comment.user.name}
                          onClick={setTitle}
                          to={`/@${comment.user.username}`}
                          className="truncate text-indigo-500 ml-1"
                        >
                          @{comment.user.name}
                        </Link>
                      </span>
                    </span>
                    <p className="text-sm mt-1 text-gray-800">{i.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }
    };

    const getComments = () => {
      $.ajax({
        method: "POST",
        url: `/api/comments/${post.id}`,
        data: {
          csrfmiddlewaretoken: data.csrfmiddlewaretoken,
          page: comments.items.length / 15 + 1,
        },
        success: (r) => {
          if (r.result) {
            const allId = comments.items.map((i) => i.id);
            r["items"] = comments.items.concat(
              r.items.map((i) => (!allId.includes(i.id) ? i : ""))
            );
            r["isReady"] = true;
            r["load"] = !comments.load;
            setComments(r);
          } else {
            showMsg("An unknown error has occurred");
          }
        },
        error: () => {
          showMsg("An unknown network error has occurred");
          setTimeout(getComments, 10000);
        },
      });
    };
    useEffect(() => {
      getComments();
    }, [1]);

    useEffect(() => {
      const load = document.querySelector("#tagsContainer .loading");

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            getComments();
          }
        });
      });
      if (load) {
        observer.observe(load);
      }
    }, [comments.load]);
    return (
      <div
        id="close"
        onClick={closeSide}
        className="bg-[#00000078] backdrop-blur-sm fixed w-screen h-screen right-0 top-0 flex flex-col-reverse sm:flex-row-reverse z-20 "
      >
        <div className="transition-all border-2 border-gray-100 flex flex-col bg-white absolute rounded-tr-3xl rounded-tl-3xl w-full h-4/5 sm:rounded-tr-none sm:rounded-bl-3xl sm:h-full sm:w-[28rem]">
          <button
            id="close"
            className="p-2 w-full flex items-center justify-center sm:w-auto sm:h-full sm:left-0 sm:absolute"
          >
            <div className="rounded-full bg-gray-200 w-20 h-1 sm:h-20 sm:w-1"></div>
          </button>
          <div
            id="tagsContainer"
            className="overflow-auto h-full sm:ml-4 px-2 pb-2"
          >
            {comments.isReady
              ? comments.items.map((i) => <Comment comment={i} key={i.id} />)
              : [1, 2, 3, 4, 5, 6].map((i) => (
                  <Comment loading={true} key={i} />
                ))}
            {comments.isReady && comments.hasNext ? <Loading /> : ""}
          </div>
          {data.me.id ? (
            <div>
              {replayTo ? (
                <div className="border-t-2 border-gray-100 w-full py-2 px-3 text-gray-500 text-sm flex justify-between">
                  <span>
                    Replaying to
                    <span className="text-indigo-500 ml-2">
                      @{replayTo.user.username}
                    </span>
                  </span>
                  <button onClick={() => setReplayTo(null)}>
                    <i className="bi bi-x-circle-fill text-gray-700"></i>
                  </button>
                </div>
              ) : (
                ""
              )}
              <div className="w-full p-2 flex border-t-2 border-gray-100">
                <img
                  src={data.me.profile}
                  alt={`${data.me.name}'s image`}
                  className="rounded-full h-9 w-9 p-1"
                />
                <input
                  dir="auto"
                  maxLength={1000}
                  id="commentInput"
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
        {is404 ? (
          <Page404 />
        ) : (
          <section className="p-6 max-w-6xl w-full">
            {post.isReady ? (
              <div>
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
                        to={
                          data.me.id == post.user.id
                            ? "/me"
                            : `/@${post.user.username}`
                        }
                        className="text-md sm:text-xl font-semibold  max-w-[13ch] sm:max-w-[25ch] lg:max-w-[50ch]"
                      >
                        {post.user.name}
                      </Link>
                      <div>
                        <span className="text-gray-500 whitespace-pre">
                          {timeSince(post.date)}
                        </span>
                        <span className="text-gray-500 mx-1 hidden sm:inline">
                          •
                        </span>
                        <span className="text-gray-500 whitespace-pre hidden sm:inline">
                          {Math.ceil(
                            cleanMd(post.text).split(" ").length / 200
                          )}{" "}
                          min <span className="hidden md:inline">read</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  {data.me.id == post.user.id ? (
                    <Link
                      to={`/write/${post.id}`}
                      className="py-1 px-3 rounded-full active:scale-[0.98] transition-all border-2 border-gray-900 "
                    >
                      Edit
                    </Link>
                  ) : (
                    <button
                      onClick={fallow}
                      className={`py-1 px-3 rounded-full active:scale-[0.98] transition-all border-2 border-indigo-500 focus-visible:scale-110 ${
                        post.user.fallowed
                          ? "text-indigo-500  bg-white"
                          : "text-white bg-indigo-500"
                      } `}
                    >
                      {post.user.fallowed ? "Unfallow" : "Fallow"}
                    </button>
                  )}
                </div>

                <div className="tags flex mt-3 items-center justify-between">
                  <div className="relative flex items-center whitespace-pre w-[calc(100%-1rem)] overflow-hidden  after:bg-gradient-to-l after:from-white after:to-transparent after:right-0 after:absolute after:h-full after:w-6">
                    {post.tags.map((i) => (
                      <Tag tag={i} key={i.id} />
                    ))}
                  </div>
                  <div className="flex">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `${window.location.origin}/@${post.user.username}/${post.slug}`
                        );
                        showMsg("Link copied");
                      }}
                      className="focus-visible:scale-110"
                    >
                      <i className="bi bi-link-45deg p-1 cursor-pointer mx-1"></i>
                    </button>
                    <button
                      onClick={bookmark}
                      className="flex focus-visible:scale-110"
                    >
                      <i
                        className={`bi bi-bookmark-${
                          post.bookmark ? "fill" : "plus"
                        } p-1 cursor-pointer mx-1 `}
                      ></i>
                    </button>
                  </div>
                </div>

                <article
                  dir="auto"
                  className="mt-2"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      marked.parse("# " + post.title + "\n" + post.text)
                    ),
                  }}
                />

                <div className="flex mt-6 items-center justify-around text-xl">
                  <button
                    className="mr-2 focus-visible:scale-110"
                    onClick={like}
                  >
                    <i
                      className={`bi bi-heart${
                        post.liked ? "-fill" : ""
                      } pl-0 p-1 text-gray-700`}
                    ></i>
                    <span className="py-1 text-gray-500 text-md">
                      {nFormatter(post.likes)}
                    </span>
                  </button>
                  <button
                    className="mr-2 focus-visible:scale-110"
                    onClick={() => setShowComments(true)}
                  >
                    <i className="bi-chat p-1 text-gray-700"></i>
                    <span className="py-1 text-gray-500 text-md">
                      {nFormatter(post.comments)}
                    </span>
                  </button>
                  {showComments ? <Container /> : ""}
                  <button
                    className="mr-2 focus-visible:scale-110"
                    onClick={bookmark}
                  >
                    <i
                      className={`bi bi-bookmark-${
                        post.bookmark ? "fill" : "plus"
                      } p-1 cursor-pointer mx-1  text-gray-700`}
                    ></i>
                    {/* <i className="bi bi-three-dots pr-0 p-1 cursor-pointer mx-1 text-gray-700"></i> */}
                  </button>
                </div>
              </div>
            ) : (
              <div>
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
                      <Tag loading={true} key={i} />
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
              </div>
            )}

            <div className="reccomeneds mt-14">
              {post.isReady ? (
                <h1 className="text-3xl border-b-2 border-gray-300 mb-4 py-2">
                  More From
                  <Link
                    name={post.user.name}
                    onClick={setTitle}
                    to={
                      data.me.id == post.user.id
                        ? "/me"
                        : `/@${post.user.username}`
                    }
                    className="text-indigo-500 mx-1"
                  >
                    {post.user.name}
                  </Link>
                </h1>
              ) : (
                <div className="border-b-2 border-gray-300 mb-4 py-2">
                  <div className="h-6 w-3/4 bg-gray-200 overflow-hidden relative fadeInLoad rounded-full" />
                </div>
              )}

              <div id="postsContainer">
                {posts.isReady
                  ? posts.items.map((p) => (
                      <Post post={p} key={p.id} onTitle={getPost} />
                    ))
                  : [1, 2, 3, 4, 5].map((i) => <Post loading={true} key={i} />)}
                {posts.isReady && posts.hasNext ? <Loading /> : ""}
              </div>
            </div>
          </section>
        )}
      </main>
    </main>
  );
};

const Page404 = () => {
  return (
    <main className="flex flex-col items-center justify-center w-full h-[100vh]">
      <h1 className="text-[140px] sm:text-[240px] font-bold">404</h1>
      <p>Sorry, this page not found :(</p>
      <Link
        name="Home"
        onClick={setTitle}
        to="/"
        className="m-4 block px-8 py-4 text-white bg-gray-900 rounded-full font-bold"
      >
        Go Home
      </Link>
    </main>
  );
};
