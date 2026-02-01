import type {NextConfig} from "next";

const nextConfig: NextConfig = {
  /* config options here */
    images:{
        remotePatterns:[
            {
                hostname: "charming-iguana-848.convex.cloud",
                protocol: "https",
                port:""

            },{
                hostname: "plus.unsplash.com",
                protocol: "https",
                port:""
            }
        ]
    }
};

export default nextConfig;
