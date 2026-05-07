import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Navigate
} from "react-router-dom";
import "./App.css";

/* =========================
   🔐 ROUTE GUARD
========================= */
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/hivemaster" replace />;

  return children;
}

/* =========================
   Navbar (절대 변경 없음)
========================= */
function Navbar() {
  return (
    <div style={styles.navbar}>
      <a
        href="https://ajinsurance.co.kr"
        target="_blank"
        rel="noreferrer"
        style={styles.logo}
      >
        AJ insurance+
      </a>
    </div>
  );
}

/* =========================
   INPUT (절대 변경 없음)
========================= */
function FancyInput(props) {
  return (
    <input
      {...props}
      style={styles.input}
      onFocus={(e) => {
        e.target.style.border = "2px solid #007bff";
        e.target.style.boxShadow = "0 0 18px rgba(0,123,255,0.5)";
      }}
      onBlur={(e) => {
        e.target.style.border = "2px solid #ccc";
        e.target.style.boxShadow = "none";
      }}
    />
  );
}

/* =========================
   BUTTON (절대 변경 없음)
========================= */
function FancyButton(props) {
  return (
    <button
      {...props}
      style={styles.startBtn}
      onMouseEnter={(e) =>
        (e.target.style.backgroundColor = "#0056b3")
      }
      onMouseLeave={(e) =>
        (e.target.style.backgroundColor = "#007bff")
      }
    />
  );
}

/* =========================
   HOME
========================= */
function Home() {

  const [done, setDone] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    name: "",
    birth: "",
    phone: ""
  });

  const [agreeOpen, setAgreeOpen] = useState(false);

  const submit = async () => {
    setLoading(true);
    setDone(false);

    const startTime = Date.now();

    try {
      await fetch("https://searchinsu.onrender.com/api/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
      });

      const res = await fetch("https://searchinsu.onrender.com/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
      });

      const data = await res.json();


      await new Promise((r) => setTimeout(r, 5000));

      if (data.length > 0) {
        setResult(data);   // 👈 여기로 변경
        setDone(true);

        setTimeout(() => {
          setDone(false);
        }, 2000);

      } else {
        alert("일치 결과 없음");
      }

    } catch (err) {
      console.error(err);
      alert("오류 발생");

    } finally {
      setLoading(false);
    }
  };

  return (

    <div style={styles.bg}>

      {result && (
        <div style={styles.resultOverlay}>
          <div style={styles.resultBox}>

            <h2>
              {result[0]?.name}님의 조회 결과
            </h2>

            <p style={{ color: "#777" }}>
              ※자사 내 보험 조회 결과입니다 타 대리점 보험은 조회되지 않습니다.
            </p>

            {result.map((item, i) => (
              <div key={i} style={styles.resultCard}>


                <div><b>보험사:</b> {item.company}</div>
                <div><b>상품명:</b> {item.product}</div>
                <div><b>전화:</b> {item.phone}</div>
                <div><b>가입일자:</b> {item.date}</div>
                <div><b>월납입료:</b> ₩{item.monthly}</div>

                <div style={styles.companyBox}>
                  <div><b>회사정보:</b> {item.companyInfo}</div>
                  <div><b>사업자등록번호:</b> {item.bizNo}</div>
                </div>

              </div>
            ))}

            <button
              onClick={() => setResult(null)}
              style={styles.closeBtn}
            >
              닫기
            </button>

          </div>
        </div>
      )}

      <Navbar />

      <div className="characterWrap">
        <img
          className="character"
          src="https://static.vecteezy.com/system/resources/previews/024/785/786/non_2x/3d-male-character-thinking-free-png.png"
          alt="character"
        />

        <div className="speechBubble">
          내가 어떤 보험 가입했었지? 😊
          <div className="speech-tail"></div>
        </div>
      </div>

      <div style={styles.overlay}>
        <div style={styles.formBox}>
          <h2 style={styles.titleText}>내 보험 간편 조회</h2>

          <FancyInput
            placeholder="이름"
            onChange={(e) =>
              setUser({ ...user, name: e.target.value })
            }
          />

          <FancyInput
            placeholder="생년월일"
            onChange={(e) =>
              setUser({ ...user, birth: e.target.value })
            }
          />

          <FancyInput
            placeholder="전화번호"
            onChange={(e) =>
              setUser({ ...user, phone: e.target.value })
            }
          />

          <FancyButton onClick={() => setAgreeOpen(true)}>
            조회
          </FancyButton>
        </div>
      </div>

      {agreeOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <h3>개인정보 이용약관</h3>

            <div style={styles.modalContent}>
              <b>개인정보 수집·이용 동의서</b>
              <br /><br />

              본인은 보험 서비스 제공을 위해 아래와 같이 개인정보 수집·이용에 동의합니다.
              <br /><br />

              <b>1. 수집하는 개인정보 항목</b><br />
              - 필수항목 : 성명, 생년월일, 성별, 휴대전화번호, 주소<br />
              - 선택항목 : 이메일, 직업, 보험가입 이력, 상담 내용<br />
              - 서비스 이용 과정에서 자동 생성되는 정보(IP, 접속기록 등)<br /><br />

              <b>2. 개인정보 수집 및 이용 목적</b><br />
              회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다.<br />
              ① 보험 가입 가능 여부 확인 및 조회 서비스 제공<br />
              ② 보험 상품 추천 및 상담 서비스 제공<br />
              ③ 계약 체결 및 유지·관리<br />
              ④ 고객 문의 및 민원 처리<br />
              ⑤ 법령상 의무 이행<br /><br />

              <b>3. 개인정보 보유 및 이용기간</b><br />
              개인정보는 수집·이용 목적 달성 시까지 보유하며,
              관계 법령에 따라 일정 기간 보관 후 지체 없이 파기합니다.<br />
              (단, 관련 법령에 따라 보존이 필요한 경우 해당 기간 보관)<br /><br />

              <b>4. 개인정보 제공 및 위탁</b><br />
              회사는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다.
              다만, 다음의 경우 예외로 합니다.<br />
              - 이용자가 사전에 동의한 경우<br />
              - 법령에 의거한 경우<br /><br />

              <b>5. 동의 거부 권리 및 불이익</b><br />
              이용자는 개인정보 수집·이용에 대한 동의를 거부할 권리가 있습니다.
              다만, 필수항목 동의 거부 시 서비스 이용이 제한될 수 있습니다.<br /><br />

              <b>※ 개인정보 보호 관련 법규 준수</b><br />
              본 동의서는 「개인정보 보호법」 및 금융 관련 법령을 준수하여 작성되었습니다.
              <br /><br />

            </div>




            <div style={styles.modalBtnBox}>
              <button
                style={styles.modalCancel}
                onClick={() => setAgreeOpen(false)}
              >
                취소
              </button>

              <button
                style={styles.modalAgree}
                onClick={() => {
                  setAgreeOpen(false);
                  submit();
                }}
              >
                동의하고 조회
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div style={styles.loadingOverlay}>
          <div style={styles.loader}></div>
          <p style={{ color: "#fff", marginTop: "10px" }}>
            조회 중입니다...
          </p>
        </div>
      )}
    </div>
  );
}

/* =========================
   ADMIN LOGIN
========================= */
function AdminLogin() {
  const nav = useNavigate();
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setError("");

    const res = await fetch("https://searchinsu.onrender.com/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: id.trim(),
        password: pw.trim()
      })
    });

    if (!res.ok) {
      setError("아이디 또는 비밀번호 오류");
      return;
    }

    const data = await res.json();
    localStorage.setItem("token", data.token);

    nav("/hivemaster/dashboard");
  };

  return (
    <>
      {loading && (
        <div style={styles.loadingOverlay}>
          <div style={styles.loader}></div>
          <p style={{ color: "#fff", marginTop: "10px" }}>
            조회 중입니다...
          </p>
        </div>
      )}

      <div style={styles.loginBox}>
        <h2>ADMIN LOGIN</h2>

        <input
          placeholder="ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
          style={styles.loginInput}
        />

        <input
          type="password"
          placeholder="PASSWORD"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          style={styles.loginInput}
        />

        <button onClick={login} style={styles.loginBtn}>
          로그인
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </>
  );
}

/* =========================
   EXCEL UPLOAD
========================= */
function ExcelUpload() {
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");

  const upload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const token = localStorage.getItem("token");

    const res = await fetch("https://searchinsu.onrender.com/api/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    const data = await res.json();
    setMsg(`업로드 완료 (${data.count ?? 0}개)`);
  };

  return (
    <div style={styles.uploadBox}>
      <p>📁 엑셀 업로드</p>

      <input
        type="file"
        accept=".xlsx"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button onClick={upload} style={styles.uploadBtn}>
        업로드
      </button>

      {msg && <p>{msg}</p>}
    </div>
  );
}

function ManualCompanyInput() {
  const [company, setCompany] = useState("");
  const [bizNo, setBizNo] = useState("");

  const save = async () => {
    if (!company || !bizNo) {
      alert("회사명과 사업자번호를 입력하세요");
      return;
    }
    await fetch("https://searchinsu.onrender.com/api/company", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        company,
        bizNo
      })
    });

    alert("등록 완료");
    setCompany("");
    setBizNo("");
  };

  return (
    <div style={styles.companyBoxSmall}>
      <h3>🏢 회사정보 수기 등록</h3>

      <input
        placeholder="회사명"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        className="companyInput"
        
      />

      <input
        placeholder="사업자등록번호"
        value={bizNo}
        onChange={(e) => setBizNo(e.target.value)}
        className="companyInput"
      />

      <button onClick={save} style={styles.uploadBtn}>
        저장
      </button>
    </div>
  );
}


/* =========================
   ADMIN DASHBOARD
========================= */
function AdminDashboard() {
  const [requestList, setRequestList] = useState([]);
  const [insuranceList, setInsuranceList] = useState([]);
  const token = localStorage.getItem("token");

  const loadRequests = async () => {
    const res = await fetch("https://searchinsu.onrender.com/api/request", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    setRequestList(Array.isArray(data) ? data : []);
  };

  const loadInsurance = async () => {
    const res = await fetch("https://searchinsu.onrender.com/insurance");
    const data = await res.json();

    setInsuranceList(Array.isArray(data) ? data : []);

  };

  useEffect(() => {
    loadRequests();
    loadInsurance();

    const interval = setInterval(() => {
      loadRequests();
      loadInsurance();
    }, 3000);
    let COMPANY_INFO
    return () => clearInterval(interval);
  }, []);

  const remove = async (id) => {
    await fetch(`https://searchinsu.onrender.com/api/request/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

      };

  return (
    <div style={styles.adminPage}>
      <h1>ADMIN DASHBOARD</h1>

      <ManualCompanyInput />

      <ExcelUpload />

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>이름</th>
            <th style={styles.th}>전화번호</th>
            <th style={styles.th}>생년월일</th>
            <th style={styles.th}>삭제</th>
          </tr>
        </thead>

        <tbody>
          {requestList.map((item) => (
            <tr key={item.id}>
              <td style={styles.td}>{item.name}</td>
              <td style={styles.td}>{item.phone}</td>
              <td style={styles.td}>{item.birth}</td>
              <td style={styles.td}>
                <button onClick={() => remove(item.id)}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ marginTop: "40px" }}>보험 DB 목록</h2>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>이름</th>
            <th style={styles.th}>생년월일</th>
            <th style={styles.th}>전화번호</th>
            <th style={styles.th}>보험사</th>
            <th style={styles.th}>보험상품</th>
            <th style={styles.th}>가입날짜</th>
            <th style={styles.th}>월납입료</th>
          </tr>
        </thead>

        <tbody>
          {insuranceList.map((item, i) => (
            <tr key={i}>
              <td style={styles.td}>{item.name}</td>
              <td style={styles.td}>{item.birth}</td>
              <td style={styles.td}>{item.phone}</td>
              <td style={styles.td}>{item.company}</td>
              <td style={styles.td}>{item.product}</td>
              <td style={styles.td}>{item.date}</td>
              <td style={styles.td}>{item.monthly}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* =========================
   ROUTER
========================= */
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hivemaster" element={<AdminLogin />} />
        <Route
          path="/hivemaster/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

const styles = {
  characterWrap: {
    position: "fixed",
    bottom: "20px",
    left: "20px",
    display: "flex",
    alignItems: "flex-end",
    gap: "10px",
    zIndex: 9999
  },

  character: {
    width: "clamp(140px, 25vw, 400px)",
    animation: "float 3s ease-in-out infinite"
  },

  speechBubble: {
    position: "absolute",
    bottom: "100%",
    left: "20%",
    transform: "translateY(-10px)",
    width: "clamp(160px, 40vw, 260px)",
    background: "#fff",
    padding: "10px 14px",
    borderRadius: "12px",
    fontSize: "clamp(12px, 2.5vw, 18px)",
    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
    animation: "bubbleFade 3s ease-in-out infinite",
    whiteSpace: "normal"
  },

  bg: {
    minHeight: "100vh",
    backgroundImage:
      "url('https://st4.depositphotos.com/1930953/24014/i/450/depositphotos_240141714-stock-photo-asian-family-two-children-walking.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflowY: "auto"
  },

  overlay: {
    width: "100%",
    minHeight: "100%",
    backgroundColor: "rgba(0,0,0,0.3)",
    backdropFilter: "blur(2px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    pointerEvents: "none",
    overflowY: "auto"
  },

  formBox: {
    background: "rgba(255,255,255,0.92)",
    padding: "32px 40px",
    borderRadius: "12px",
    width: "300px",
    textAlign: "center",
    pointerEvents: "auto"
  },

  input: {
    width: "85%",
    padding: "14px",
    marginBottom: "14px",
    borderRadius: "10px",
    border: "2px solid #ccc"
  },

  startBtn: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "8px"
  },

  navbar: {
    position: "fixed",
    top: 0,
    width: "100%",
    padding: "15px 30px",
    backgroundColor: "rgba(0,0,0,0.7)",
    zIndex: 9999
  },

  logo: {
    color: "white",
    textDecoration: "none",
    fontWeight: "bold"
  },

  loginBox: { padding: "100px", textAlign: "center" },
  loginInput: { display: "block", margin: "10px auto", padding: "10px" },
  loginBtn: { padding: "10px 20px" },

  adminPage: { padding: "40px" },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#fff"
  },

  th: {
    border: "1px solid #ddd",
    padding: "10px",
    background: "#f5f5f5"
  },

  td: {
    border: "1px solid #ddd",
    padding: "10px",
    textAlign: "center"
  },

  uploadBox: {
    border: "2px dashed #aaa",
    padding: "15px",
    marginBottom: "20px",
    borderRadius: "10px",
    textAlign: "center",
    background: "#fafafa"
  },

  uploadBtn: {
    marginTop: "10px",
    padding: "8px 15px",
    background: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "6px"
  },

  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999
  },

  modalBox: {
    width: "500px",
    maxWidth: "90vw",
    maxHeight: "80vh",
    background: "#fff",
    borderRadius: "12px",
    padding: "25px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
    display: "flex",
    flexDirection: "column"
  },

  modalContent: {
    fontSize: "13px",
    color: "#555",
    lineHeight: "1.6",
    marginTop: "10px",
    maxHeight: "60vh",
    overflowY: "auto",
    paddingRight: "8px"
  },

  modalBtnBox: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "20px",
    gap: "10px"
  },

  modalCancel: {
    padding: "8px 14px",
    border: "1px solid #ccc",
    background: "#fff",
    cursor: "pointer"
  },

  modalAgree: {
    padding: "8px 14px",
    border: "none",
    background: "#007bff",
    color: "#fff",
    cursor: "pointer"
  },

  loadingOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10000
  },

  loader: {
    width: "50px",
    height: "50px",
    border: "5px solid #eee",
    borderTop: "5px solid #007bff",
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
  },

  resultOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 99999
  },

  resultBox: {
    width: "700px",
    background: "#fff",
    padding: "25px",
    borderRadius: "12px",
    maxHeight: "80vh",
    overflowY: "auto"
  },

  resultCard: {
    border: "1px solid #eee",
    padding: "25px",
    marginTop: "20px",
    borderRadius: "16px",
    lineHeight: "1.8",
    fontSize: "15px",
    background: "#fafafa",
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)"
  },

  closeBtn: {
    marginTop: "15px",
    padding: "10px",
    width: "100%",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "8px"
  },

  companyBox: {
    marginTop: "15px",
    paddingTop: "15px",
    borderTop: "1px solid #eee",
    fontSize: "13px",
    color: "#666"
  },

  companyBoxSmall: {
    position: "fixed",
    top: "10px",
    right: "20px",
    width: "220px",
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    background: "#fff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    zIndex: 9999
  },


};