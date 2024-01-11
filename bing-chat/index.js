import express from "express";
import bodyParser from "body-parser";
import { BingAIClient } from "@waylaidwanderer/chatgpt-api";

const app = express();
const port = 3002;

const cookie = `MUID=0191549D66B86DF53CFB470E67116C0E; SRCHD=AF=NOFORM; SRCHUID=V=2&GUID=0B56BD0CAEE04724B1B24BA262A34F28&dmnchg=1; MUIDB=0191549D66B86DF53CFB470E67116C0E; USRLOC=HS=1&ELOC=LAT=47.474945068359375|LON=19.075119018554688|N=Budapest%2C%20Budapest|ELT=6|; BCP=AD=1&AL=1&SM=1; SUID=M; _EDGE_S=SID=074C5A78A9D4628D39DF49ECA8AF630B; SRCHS=PC=U531; _Rwho=u=d; ipv6=hit=1695400233702&t=6; CSRFCookie=5c01bf84-6fad-499d-aeee-a69e341db738; BFB=AhCJM7nrMkhrkAGed7PGcLqz8YdEy7oA1RgOPMsq_xZX3kFbMe0jLZe0G7ZlClfqzwKH2fjgu6Nvgw-Hi5zINMBqsbVPxpZrvsHmx3skXgpbnBqRT0wj_c6hHLxOqY2yO820Ql3lPuz3xbgp_a0xBb1wfYEqpo7JEdNM3sBMrFQeiw; OID=AhBbP8SyLLiXUbQ1XUPV2ct5seHVfKnJoRa5Z16jtGfMuuzX7wW42ribbp-kpiWN3TsdgOm7JOIKAYhoSoZqsrxQHMFt6WKyxxMM0KAn1xha_6BllVcu-aOwjo5CMYMobSUKsk6MszL7REwa0ki_d5RP; OIDI=ghAmq2MRBoV7NKvQYHvcoOH7TElGd0QJbhhQyU4iyZr22F9Z3FMIWdFNxgFgNb8Em48ZftSd3S_jCs0EFaPQDMaAmKjKGGZw0QfxEfPseO06kp_iD1RMhbG3fwkk3ZAWp35tvs67W5PK-X8Y-O25Ftv6KSUqOdH4ghh6qrPBHFkWnokmz7fcQ5sYZuLdalJGG7Im7FuynWJJFhL99pQytGfNSfaKzOTbWud0WIKPwwueeXLPrFvwVbqMu1uPBEte4mQkLAKNMihCIDa9JpKcUimTSnmnkeAw02PDHtWocgrA2b0GvjPOINnj0GaIz_N9w6TJvviBErSidBYFdv9wG_blOdolrkX3h7jycgkDqDeKhu1M8eOoONbaiDqoiHU-Sg5fJJ4hHvKPh-y_leupP5pr_5luRRxSp4KF3_nHGVBe859Ju3w-gUeFFm2nQ4oKDUGi4TfYvMUBZAareBjyqJ-bfvQFpW_Ho4-uChh-fXmmGnHPThzIjkG3yvVyeVs5q1b8I3VKQRhZ49r4wqWdcgXKcrDjOxvQXryjSVPoPdVOkm9z418FD_pncvHjYeh9P522XDIKkhxKKByVQBxjfA2lzSQT7Yp20nj_1h54RA4SpY4fEtTcFh0p9z01__VKuesr9P1IeUGHe4sROEAxaLTgvW4p98QF-lWMThKu216picgKho4_YdMxCsYHUqKd3BQtIFAZ0tSIHrQVTHy9YDAzq1w8MvPN3kZRfj-dJE2N2in3sHpYWK-oRsnOIskvh9a46nUoaxiXtDo8FHtIaHbREiOlunSUMWqtqGyhdBf9wGEbiSg-2JCjeQKZG2ypNYq8iS-N8wxwqQqfculyZzQT1IfoPOpwIMKFpOXFR5GuJ6IrmUZZYkGeYja3L8ubiSWKgSMphVLiIMGhS_YrtIxD_RTrPYZlMHP5OCYXhoYtfKuJyCLyOfwYnHVLYNhkn9L7hyl8Txj31IUXx8xKEF2FhI_40SkMiSUIs1DymlE4e7R5gMSRm8J956rEhyHK4ghDZTfhPKTMZajJQizouQQbQWZtaiPZnTNRMtyt3GWTWPmcOPhBBFJSXsT-lQ57QZbJaOl0wj66wHN6Yl1H4juZKTRTeAebNnD90X9iV__ztq0TSt66odUN_WlMIvKTG3Imv4W4uwmLoJ4jpgE5G3MejiwcNwQLbosNOcCA0q-qqf-PaMZIauRnSrN7Pl4WNhq-7ZJ_SNqsjBz5mkek8-xJRPD3509CqWOdo3gHYlgMcNnpc8tRCFIFO7epIxM1NzoNm-tP1iw6MkIgEl1apkNi9Q0P1oidUUvsNjsenw8wUV_rn-4m-czU_79TTQMqPVAVsYAdNgNP4ZYcdO9HZyqLr9nT7GT-lrygD85269PGp5hxlMmtorRfq43o_6NpFvUG6UG933si3y49CAw-EjiH3wb78i_rtGppVpD7NXmzgMlww-2G6yw2EoXVYG8hJC6uVN6Q70ngoztmu3WnHT_hh1bAeCmqmyCqiBCC-Jrxsjn58hkMQXA_OvQm2AV8LedHpcYaGExr3FLaLodHLzKdsB1BewEIu8v3zEWtLvizv5cyxpD8Y9Hwms73qOb3zlzmpgAGygIQ4JDjMNprY6pGxNluwsqDyc2UElwkljLRtCvKqwxcDzGPjKPGPWzuM2jtiDkdtPuBxrX-9SWIXonKF2HZDw9zW_al6JbABMzu56PZOdYUhvrijN2dqWDlfzcXBQ-kywSYvdNIRN6wYJspzgLiHpk-dMw9sNGC5xWsSppHWZ-515bUfjdWNiibpLDnTkcaQk5huQgGjL4ukvrWC_X-6whodsUARZysBmqVown2wnvpiQS-vV1VpFqGh5Ji3iRB7Ymu-E3mdwL5rRtL8tOAtngAKJe7E6cdaCckjx86RX1m38hOQz8ipoa-iRTLR0Hj8_6yixuUvGzc5NxcuOvAePsJi9yV9LHU5gbZ3w; OIDR=ghBvUDT3jK--VhFrNWpUBvRqJYEYUsOIzgIg_DAK9idOSIvj9R_MR7vzx-12eP4pecN-S24U9fKYziKN6W86GNT8aNj0ikqwbRCq3uP7L9GEzMa0U8y70WrBM5C46Ux49qG36kYC-EdoGTm2cWHd30pAeUSvIapEvC3CeqmqjBLTKpySAwRFVca1WvNI0YHB-u1dywTBBG7YR7cZVxqNWjvCn7pNNriBZnKVNFdSa60KWnYTieBoLjYo-PUEkzWtXAlB2rIx_I0AreyMa1NulUr7GMst5lI4avp2RKj6Yst0TDhelWW-s7bUwH6ZIycZeSf_BbF_IjUc_WR7fJ_U7pPcBrehz7nQfsRlUEzO7ZG5QgFcCClByqM1QhvyuqYqdu3EmhqcGI_NhwY0y3SjxAujqz9K7J0OzPLGOksbhsiV-Zn-8cEQZO0qxi6XhxE0tqWLBp3phBVhKgXIjaFbcvxFPvTj2OvbrpMqOBnSDOKV32TPgaTIZiLl8iMioTXAIkC1_sLLbXsixbkC3qtVnwNGQmtnp16tDe64S4JHDSIpX5xnX_VffR2RKa_HG7vInw2g_0YKpjL-fsgzBe3kAetbqqE8ITNGLPkIy_oufbgyo6-e7EJgHHi13gTMJqDt-dleut3hRCQhKw1wNkU1m1VJORsRe2CkKbmqs5szUwqwRCUmhC4PwboKfcZWxakEBObfqnjwd9RCzRtdywBiaHma9OYwx3V_zlHRkAGmOAQCY4LJYtJqe28qvkfAyE2pprJTOPc4g_qdYxP_whgZZvRvn4x1c7u0j-crqUy1VE_SsAiza_jx-SrvKsP0qytq7e2ezgBlxDLmt-XBg1RjHL7JiAkE_YZF2bSIa1GrvNdYyAutNjsW4lzxlPdiryD3_rQIFSoi0bwz9I3k8Dpv6cMBiTEjaesBYQI5ouA8aQo4Sxvr84sAOQ5aapIGOVknnTh7qLLPNl0KGxLDJdqs8AZz-BWEEOF6PxjgrAv_0stX0mi6jMqg75KBE600FFQF3HzwLM-T5_K3Apvck1JoW8CA-lPXA4ObCpVy9uIJb628IIYpHrxgJgjvVLkDh9Zbii9eUv1t-ra-KopbUUZJr4zzYgMrdz1gE73R12Ys0JUXhmUeTSSS83Wtp4tzS4rcVnA; SRCHUSR=DOB=20230921&T=1695396629000&POEX=O; ACL=AhAG6Pckz21NgmNPzNt7OqOEYcBbkiZn5ZT1c94KIuGxdNH9T_gRtroyQhL09USbmnJUtQfY1ao4rInlA5eIXJvf; ACLUSR=T=1695396714000; _clck=1wxb2sy|2|ff8|0|1360; _clsk=x03pcw|1695396752459|1|1|q.clarity.ms/collect; GC=APYjen7tFVByIBAa_B1TXJdw-enIOivmoJ_0mAxoXICmmUpazUGENhBxpSnbFlSn_2v79U567OAAS04mtzo19g; _RwBf=r=0&ilt=21&ihpd=0&ispd=15&rc=57&rb=0&gb=0&rg=200&pc=54&mtu=0&rbb=0&g=0&cid=&clo=0&v=17&l=2023-09-22T07:00:00.0000000Z&lft=0001-01-01T00:00:00.0000000&aof=0&o=2&p=&c=&t=0&s=0001-01-01T00:00:00.0000000+00:00&ts=2023-09-22T16:13:13.7025252+00:00&rwred=0&wls=&wlb=&lka=0&lkt=1&TH=; _SS=PC=U531&SID=074C5A78A9D4628D39DF49ECA8AF630B&R=57&RB=0&GB=0&RG=200&RP=54&OCID=MY0291; dsc=order=News; SRCHHPGUSR=WTS=63830993429&SRCHLANG=hu&PV=13.5.2&BRW=W&BRH=S&CW=1354&CH=331&SCW=1339&SCH=3842&cdxtone=Balanced&cdxtoneopts=galileo,saharagenconv5&PRVCW=1354&PRVCH=331&DPR=1.0&UTC=120&DM=0&EXLTT=16&HV=1695399195&EXLKNT=1&NRSLT=-1&LSL=0&AS=1&ADLT=OFF&NNT=1&HAP=0&VSRO=1&CHTRSP=1`;

const options = {
  host: "",
  userToken: "0191549D66B86DF53CFB470E67116C0E",
  cookies: cookie,
  proxy: "",
  debug: true,
};

let bingAIClient = new BingAIClient(options);

app.use(bodyParser.json());

app.post("/send-message", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    let response = await bingAIClient.sendMessage(
      "split this into sections" + message,
      {
        toneStyle: "fast", // balanced or creative, precise, fast
      }
    );

    const cleaned = response.response
      .replace(/[*#]/g, "")
      .replace(/(\d+\.\s*)|(-\s*)/g, "");
    console.log(cleaned);

    res.json({ message: cleaned });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
app.listen(process.env.PORT || port, () => {
  console.log(`Server is running on port ${process.env.PORT || port}`);
});
