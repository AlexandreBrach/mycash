FROM python:3.7
RUN apt-get update && \
    apt-get install -y \
    entr \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/
RUN curl https://beyondgrep.com/ack-v3.4.0 > /usr/bin/ack && chmod 0755 /usr/bin/ack
ADD ./files /
RUN pip install --upgrade pip
WORKDIR /src
COPY ./src/requirements.txt /src/requirements.txt
RUN pip install -r requirements.txt
COPY ./src /src
CMD /run.sh
