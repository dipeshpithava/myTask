MongoDB Settings:

use admin
db.createUser(
  {
    user: "adminUser",
    pwd: "mYstr0ngPa$$word",
    roles: [ { role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase" ]
  }
)

Pattern:
mongodb://[username:password@]host1[:port1][,...hostN[:portN]][/[defaultauthdb][?options]]

Connection URI (You can change IP and credentials as per your configurations):
mongodb://adminUser:mYstr0ngPa$$word@127.0.0.1:27017/?authSource=admin

Initial Data:
db.createCollection("userprofile")
db.userprofile.insert( { emailId: "dipesh@gmail.com", password: "Abcd@12345", isActive: 1 } )
db.userprofile.insert( { emailId: "dipesh1@gmail.com", password: "Admin@12345", isActive: 1 } )
db.userprofile.insert( { emailId: "dipesh3@gmail.com", password: "Admin@54321", isActive: 0 } )
db.userprofile.find( {} )

--------------------------------------------------------------------------------------------------------
React Settings:

npm install

File location: FrontEnd/src/component/pages/Home/Home.js
Line No.: 66
Change the API URL as per your configuration.

Starting React in DEV Mode
npm start

--------------------------------------------------------------------------------------------------------
Installation of Kubernetes

On both the master and worker nodes:
	sudo su
	yum install docker -y 
	systemctl enable docker && systemctl start docker

------------------

cat <<EOF > /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=1
repo_gpgcheck=0
gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
exclude=kube*
EOF

------------------

cat <<EOF >  /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
EOF

------------------

sysctl --system
setenforce 0

------------------

	yum install -y kubelet kubeadm kubectl --disableexcludes=kubernetes
	systemctl enable kubelet && systemctl start kubelet

------------------

Only on the Master Node:
	sudo kubeadm init --pod-network-cidr=192.168.0.0/16

- This will also generate a kubeadm join command with some tokens.
- Wait for around 4 minutes. Following commands will appear on the output screen of the master node.

	mkdir -p $HOME/.kube
	sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
	sudo chown $(id -u):$(id -g) $HOME/.kube/config

------------------

On Worker nodes:
	sudo su
	<kubeadm join command copies from master node>

------------------

On Master and Worker Node:
	export KUBECONFIG=/etc/kubernetes/kubelet.conf

------------------

On Master Node:
	kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml

	kubectl get deployments

	kubectl get nodes

	kubectl get pods --all-namespaces


--------------------------------------------------------------------------------------------------------
Your Kubernetes control-plane has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

Alternatively, if you are the root user, you can run:

  export KUBECONFIG=/etc/kubernetes/admin.conf

You should now deploy a pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  https://kubernetes.io/docs/concepts/cluster-administration/addons/

Then you can join any number of worker nodes by running the following on each as root:

kubeadm join 172.31.5.206:6443 --token 7f4i03.lah2lyg4r8n6cp9m \
	--discovery-token-ca-cert-hash sha256:93f3c65cdca9e05b8f568d0b52a64b28d38e17a7b393809b002954803db653be


	kubeadm join 172.31.5.206:6443 --token 7f4i03.lah2lyg4r8n6cp9m --discovery-token-ca-cert-hash sha256:93f3c65cdca9e05b8f568d0b52a64b28d38e17a7b393809b002954803db653be

--------------------------------------------------------------------------------------------------------
kubectl apply -f deploy.yaml

You can find deploy.yaml file inside API/deploy.yaml

sudo kubectl create service nodeport nginx --tcp=80:80