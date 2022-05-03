const Link = ReactRouterDOM.Link;
const Route = ReactRouterDOM.Route;
const Router = ReactRouterDOM.BrowserRouter;
const Switch = ReactRouterDOM.Switch;
const useParams = ReactRouterDOM.useParams;
const useContext = React.useContext;
const useState = React.useState;
const useEffect = React.useEffect;
const createContext = React.createContext;

const Loading = ({ classNames }) => {
  return <div className={"loader " + classNames}></div>;
};

const Auth = ({ page }) => {
  const [data, setData] = useContext(Context).data;

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

  const hanldeClickHelpBtn = () => {
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
    <main className="flex flex-col justify-between items-center w-full h-[100vh] relative ">
      <span name="tmp"></span>
      <form
        className="p-4 flex items-center max-w-[20rem] min-w-[15rem] flex-col justify-center relative"
        method="POST"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-medium my-4">{status.replace(/\W+/g, " ")}</h1>
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
              messages.username || messages.__all__ ? "opacity-100" : ""
            }`}
          >
            {messages.username || messages.__all__ || "Invalid username. e.g user.n_ame"}
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
            className={`text-sm ${status == "Sign-up"?"text-red-500":"text-white"} pt-1 ${
              messages.password2 ? "opacity-100" : ""
            }`}
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
                messages.email ? "opacity-100" : ""
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
